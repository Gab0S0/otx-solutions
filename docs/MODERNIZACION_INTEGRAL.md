# Modernización Integral y Actualización de Servicios — OTX Solutions

Continuación sobre la base publicada en `main` (tras el merge del PR #1). Rama de trabajo: `modernizacion-integral-2026-10`. Sin merge ni despliegue a producción.

## 1. Catálogo comercial actualizado (`Servicios`)

Se mantiene intacta la identidad visual aprobada de **Servicios** y **Precios** (`.otx-offer`), actualizando la oferta comercial en tres bloques claros:

1. **Soporte y operación IT**
   - **Soporte Técnico Remoto** *(servicio principal para particulares y empresas)*
   - **Seguridad Informática, Optimización y Mantenimiento**
   - **Microsoft 365 para Empresas**
2. **Equipamiento y hardware**
   - **Asesoramiento Tecnológico y Presupuestos** *(selección de notebooks, PC gamer, computadoras para oficinas, monitores, periféricos y presupuestos completos)*
   - **Armado, Actualización y Reparación de Equipos** *(según evaluación y diagnóstico previo)*
3. **Web, formularios e IA**
   - **Desarrollo de Páginas Web y Formularios**
   - **Automatizaciones, Asistentes e Integraciones con IA** *(proyectos a medida)*

Se conservan sin cambios todos los importes, planes, extras y condiciones de **Precios** (`Personas`, `Empresas` y `Microsoft 365`).

## 2. Secciones modernizadas

- **Header y Hero**: intactos (`Header.jsx`, `Hero.jsx`, `PremiumIntro.css`).
- **Cómo trabajamos (`HowItWorks.jsx`)**: estructura editorial en tres pasos numerados (`01`, `02`, `03`) con divisores finos y barra de acción directa a WhatsApp, Contacto y Tickets.
- **Por qué elegirnos (`WhyUs.jsx`)**: se eliminaron por completo las estadísticas comerciales sin respaldo (`+10 años`, `+1.000 casos`, `98%`, `<30 min`). Se reemplazaron por compromisos concretos de trabajo (alcance confirmado antes de avanzar, conexión remota supervisada, garantía de revisión de 48 hs sobre el mismo incidente y criterio técnico objetivo) junto con cuatro pilares comerciales claros.
- **Preguntas frecuentes (`FAQ.jsx`)**: disposición asimétrica de dos columnas con desplegables nativos accesibles (`aria-expanded`, `aria-controls`), incorporando consultas sobre asesoramiento/reparación de hardware y proyectos de páginas web, formularios e IA a medida.
- **Contacto (`Contact.jsx`) y Tickets (`TicketPage.jsx`)**: formularios integrados en la paleta grafito (`#04070C`, `#080D16`, `#CFE4F7`, `#8FE3C0`), etiquetas vinculadas por `id` a cada selector, soporte completo de prellenado desde Servicios y Precios, y corrección del valor `particular` en el selector de tipo de cliente de Contacto para coincidir con la validación del backend.
- **Footer (`Footer.jsx`)**: cierre sobrio con marca `otx.`, navegación directa a todas las secciones y datos de contacto verificados, sin afirmaciones infundadas.
- **Eliminación total de la estética antigua**: cero referencias al color bordó/rojo (`#7A0D1A`, `#9A1525`, `otx-bordo`) en componentes, hojas de estilo, barra de desplazamiento y selección de texto.

## 3. Capturas reales (Escritorio 1440×900 y Móvil 390×844)

| Sección | Escritorio (1440×900) | Móvil (390×844) |
| --- | --- | --- |
| **Servicios actualizados** | ![Servicios escritorio](preview-modernizacion/services-desktop.png) | ![Servicios móvil](preview-modernizacion/services-mobile.png) |
| **Cómo trabajamos** | ![Cómo trabajamos escritorio](preview-modernizacion/how-it-works-desktop.png) | ![Cómo trabajamos móvil](preview-modernizacion/how-it-works-mobile.png) |
| **Por qué elegirnos** | ![Por qué elegirnos escritorio](preview-modernizacion/why-us-desktop.png) | ![Por qué elegirnos móvil](preview-modernizacion/why-us-mobile.png) |
| **Preguntas frecuentes** | ![FAQ escritorio](preview-modernizacion/faq-desktop.png) | ![FAQ móvil](preview-modernizacion/faq-mobile.png) |
| **Contacto** | ![Contacto escritorio](preview-modernizacion/contact-desktop.png) | ![Contacto móvil](preview-modernizacion/contact-mobile.png) |
| **Tickets (`/ticket`)** | ![Tickets escritorio](preview-modernizacion/ticket-desktop.png) | ![Tickets móvil](preview-modernizacion/ticket-mobile.png) |
| **Footer** | ![Footer escritorio](preview-modernizacion/footer-desktop.png) | ![Footer móvil](preview-modernizacion/footer-mobile.png) |

## 4. Validación técnica

- **Compilación de producción**: `REACT_APP_BACKEND_URL=http://127.0.0.1:8001 npm --prefix frontend run build` sin errores ni advertencias de compilación (~144,4 kB JS gzip, ~13,1 kB CSS gzip).
- **Responsive**: verificado sin desbordamiento horizontal (`overflowX: false`) en `320×740`, `375×667`, `390×844`, `768×1024`, `1280×720`, `1440×900` y `1920×1080`.
- **Flujos funcionales**: prellenado de Contacto desde Servicios/Precios y prellenado por parámetros URL en `/ticket` comprobados ([checks.json](preview-modernizacion/checks.json)).
