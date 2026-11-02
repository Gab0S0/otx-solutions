from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import httpx
import os
import re
import logging
from collections import defaultdict
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tickets", tags=["tickets"])

# Rate limiting storage (in-memory, resets on restart)
rate_limit_store = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 3  # max requests per window per IP

INVALID_TICKET_IDS = {
    "n/a",
    "na",
    "none",
    "null",
    "undefined",
    "false",
    "blocked",
    "error",
    "test",
    "0",
}
TICKET_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{3,63}$")


def is_valid_ticket_id(value: object) -> bool:
    """Validate that a ticket identifier is real and not a placeholder/fallback."""
    if not isinstance(value, str):
        return False
    cleaned = value.strip()
    if len(cleaned) < 4 or len(cleaned) > 64:
        return False
    if cleaned.lower() in INVALID_TICKET_IDS:
        return False
    return bool(TICKET_ID_PATTERN.match(cleaned))


class TicketCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    telefono: Optional[str] = Field(None, max_length=30)
    tipo: str = Field(..., pattern="^(particular|pyme)$")
    asunto: str = Field(..., min_length=3, max_length=200)
    mensaje: str = Field(..., min_length=10, max_length=2000)
    plan: Optional[str] = Field(None, max_length=150)
    servicio: Optional[str] = Field(None, max_length=150)
    canal: Optional[str] = Field("TicketWeb", max_length=50)
    # Honeypot field - should remain empty for legitimate users
    website: Optional[str] = Field("", max_length=200)

    @field_validator("nombre", "asunto", "mensaje", mode="before")
    @classmethod
    def strip_required_text(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


class TicketResponse(BaseModel):
    success: bool
    message: str
    ticket_id: str


def check_rate_limit(ip: str) -> bool:
    """Check if IP is within rate limit. Returns True if allowed."""
    current_time = time.time()

    # Clean old entries
    rate_limit_store[ip] = [
        timestamp for timestamp in rate_limit_store[ip]
        if current_time - timestamp < RATE_LIMIT_WINDOW
    ]

    # Check limit
    if len(rate_limit_store[ip]) >= RATE_LIMIT_MAX_REQUESTS:
        return False

    # Add new request
    rate_limit_store[ip].append(current_time)
    return True


@router.post("", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate, request: Request):
    """Create a new support ticket via Google Apps Script (Google Sheets + email notification)."""

    # Get client IP safely
    client_ip = request.client.host if request.client else "unknown"
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    # Check rate limit
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Demasiadas solicitudes. Por favor esperá un minuto antes de intentar de nuevo."
        )

    # Honeypot check - never return a fake success confirmation
    if ticket.website and ticket.website.strip():
        logger.warning(f"Honeypot triggered from IP: {client_ip}")
        raise HTTPException(
            status_code=400,
            detail="No se pudo validar el envío del formulario. Por favor contactanos por WhatsApp."
        )

    # Get Google Apps Script URL from environment
    apps_script_url = (os.environ.get("GOOGLE_APPS_SCRIPT_URL") or "").strip()

    if not apps_script_url:
        logger.error("GOOGLE_APPS_SCRIPT_URL not configured")
        raise HTTPException(
            status_code=503,
            detail="El servicio de registro de tickets no está disponible en este momento. Podés contactarnos directamente por WhatsApp o correo electrónico."
        )

    # Prepare data for Google Apps Script
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    payload = {
        "timestamp": timestamp,
        "nombre": ticket.nombre,
        "email": ticket.email,
        "telefono": (ticket.telefono or "").strip() or "No proporcionado",
        "tipo": ticket.tipo,
        "asunto": ticket.asunto,
        "mensaje": ticket.mensaje,
        "plan": (ticket.plan or "").strip(),
        "servicio": (ticket.servicio or "").strip(),
        "canal": (ticket.canal or "TicketWeb").strip(),
        "ip": client_ip
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                apps_script_url,
                json=payload,
                follow_redirects=True
            )

        if response.status_code != 200:
            logger.error(f"Apps Script HTTP error: {response.status_code} - {response.text[:300]}")
            raise HTTPException(
                status_code=502,
                detail="Error al procesar el ticket en el servidor externo. Por favor intentá de nuevo o contactanos por WhatsApp."
            )

        try:
            result = response.json()
        except ValueError:
            logger.error(f"Apps Script returned non-JSON body: {response.text[:300]}")
            raise HTTPException(
                status_code=502,
                detail="Respuesta inválida del servicio de tickets. Por favor contactanos por WhatsApp."
            )

        if not isinstance(result, dict) or result.get("success") is not True:
            ext_error = result.get("error") if isinstance(result, dict) else "Invalid payload"
            logger.error(f"Apps Script reported failure: {ext_error}")
            raise HTTPException(
                status_code=502,
                detail="No se pudo confirmar el registro del ticket. Por favor intentá de nuevo o contactanos por WhatsApp."
            )

        raw_ticket_id = result.get("ticketId") or result.get("ticket_id")
        if not is_valid_ticket_id(raw_ticket_id):
            logger.error(f"Apps Script returned invalid ticketId: {raw_ticket_id!r}")
            raise HTTPException(
                status_code=502,
                detail="No recibimos un número de ticket válido del servidor. Por favor contactanos por WhatsApp."
            )

        clean_ticket_id = str(raw_ticket_id).strip()
        logger.info(f"Ticket created successfully: {clean_ticket_id}")

        return TicketResponse(
            success=True,
            message=f"¡Ticket #{clean_ticket_id} creado! Te responderemos a la brevedad.",
            ticket_id=clean_ticket_id
        )

    except HTTPException:
        raise
    except httpx.TimeoutException:
        logger.error("Timeout calling Google Apps Script")
        raise HTTPException(
            status_code=504,
            detail="El servidor tardó demasiado en responder. Por favor intentá de nuevo o contactanos por WhatsApp."
        )
    except httpx.RequestError as exc:
        logger.error(f"Network error calling Google Apps Script: {exc}")
        raise HTTPException(
            status_code=502,
            detail="No se pudo conectar con el servicio de tickets. Por favor contactanos por WhatsApp."
        )
    except Exception as e:
        logger.error(f"Unexpected error creating ticket: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error inesperado al registrar la solicitud. Por favor contactanos por WhatsApp."
        )
