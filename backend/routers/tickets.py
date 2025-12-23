from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
import httpx
import os
import logging
from collections import defaultdict
import time

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tickets", tags=["tickets"])

# Rate limiting storage (in-memory, resets on restart)
rate_limit_store = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 3  # max requests per window per IP


class TicketCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    telefono: Optional[str] = Field(None, max_length=20)
    tipo: str = Field(..., pattern="^(particular|pyme)$")
    asunto: str = Field(..., min_length=3, max_length=200)
    mensaje: str = Field(..., min_length=10, max_length=2000)
    plan: Optional[str] = Field(None, max_length=100)
    servicio: Optional[str] = Field(None, max_length=100)
    # Honeypot field - should be empty
    website: Optional[str] = Field(None, max_length=0)


class TicketResponse(BaseModel):
    success: bool
    message: str
    ticket_id: Optional[str] = None


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
    """Create a new support ticket - saves to Google Sheets and sends email."""
    
    # Get client IP
    client_ip = request.client.host
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    
    # Check rate limit
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Demasiadas solicitudes. Por favor esperá un minuto antes de intentar de nuevo."
        )
    
    # Honeypot check - if website field has content, it's a bot
    if ticket.website:
        logger.warning(f"Honeypot triggered from IP: {client_ip}")
        # Return success to not alert the bot, but don't process
        return TicketResponse(
            success=True,
            message="Ticket enviado correctamente.",
            ticket_id="BLOCKED"
        )
    
    # Get Google Apps Script URL from environment
    apps_script_url = os.environ.get("GOOGLE_APPS_SCRIPT_URL")
    
    if not apps_script_url:
        logger.error("GOOGLE_APPS_SCRIPT_URL not configured")
        raise HTTPException(
            status_code=500,
            detail="Error de configuración del servidor. Contactanos por WhatsApp."
        )
    
    # Prepare data for Google Apps Script
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    payload = {
        "timestamp": timestamp,
        "nombre": ticket.nombre,
        "email": ticket.email,
        "telefono": ticket.telefono or "No proporcionado",
        "tipo": ticket.tipo,
        "asunto": ticket.asunto,
        "mensaje": ticket.mensaje,
        "plan": ticket.plan or "",
        "servicio": ticket.servicio or "",
        "ip": client_ip
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                apps_script_url,
                json=payload,
                follow_redirects=True
            )
            
            if response.status_code == 200:
                result = response.json()
                ticket_id = result.get("ticketId", "N/A")
                
                logger.info(f"Ticket created successfully: {ticket_id}")
                
                return TicketResponse(
                    success=True,
                    message=f"¡Ticket #{ticket_id} creado! Te responderemos a la brevedad.",
                    ticket_id=str(ticket_id)
                )
            else:
                logger.error(f"Apps Script error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=500,
                    detail="Error al procesar el ticket. Por favor intentá de nuevo o contactanos por WhatsApp."
                )
                
    except httpx.TimeoutException:
        logger.error("Timeout calling Google Apps Script")
        raise HTTPException(
            status_code=504,
            detail="El servidor tardó demasiado en responder. Por favor intentá de nuevo."
        )
    except Exception as e:
        logger.error(f"Error creating ticket: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error inesperado. Por favor contactanos por WhatsApp."
        )
