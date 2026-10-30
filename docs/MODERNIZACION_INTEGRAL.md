# Revisión Integral de Dirección Artística, Experiencia de Usuario y Credibilidad Comercial — OTX Solutions

Continuación sobre la rama `modernizacion-integral-2026-10` (**PR #2**). Sin merge a `main` ni despliegue a producción.

---

## 1. Síntesis de cambios implementados

Manteniendo intactos **Header**, **Hero** (`Tecnología sin complicaciones.`), la identidad `otx.`, los acentos verde (`#8FE3C0`) y champagne (`#E5D3B3`) y la totalidad de los precios y condiciones vigentes:

1. **Profundidad ambiental y relieve grafito coherente con el Hero (`PremiumOffer.css` & `PremiumSections.css`)**:
   - Se extendió la textura satinada de bajo relieve del Hero (`otx-surface-desktop.webp` / `otx-surface-mobile.webp`, sin peso adicional de red al reutilizar el mismo recurso ya cargado) junto con iluminación ambiental radial controlada, superficies grafito por capas (`#04070C`, `#060B13`, `#070C14`, `#09101B`) y filetes arquitectónicos sutiles entre secciones.
2. **Compactación y jerarquía ponderada en Servicios (`Services.jsx`)**:
   - **Reducción de altura en móvil (`390px`)**: de `6.245 px` a **`4.472 px`** (**`-1.773 px` / `-28%`**). En escritorio (`1440px`), de `4.197 px` a **`2.531 px`** (**`-1.666 px` / `-40%`**).
   - **01 · Soporte y continuidad tecnológica**: el servicio principal (*Soporte técnico para particulares, profesionales y oficinas*, remoto o con visita a coordinar) ocupa una columna destacada con mayor peso visual, acompañado a la derecha por 3 bloques secundarios (*Mantenimiento, seguridad y respaldo*, *Equipamiento, armado y oficinas*, *Soporte mensual para empresas*), eliminando introducciones y precios duplicados.
   - **02 · Optimización, herramientas y proyectos**: encabezado por **"¿Estás utilizando las herramientas adecuadas para tu trabajo?"**, con banda destacada para **Asesoramiento tecnológico y productividad** (reemplazando la denominación genérica de *Capacitación personalizada*) y 3 bloques de proyecto (*Microsoft 365 y entorno empresarial*, *Desarrollo web y formularios*, *Integraciones, automatización e IA*).
3. **Demostración editorial compacta de Automatización (`#automatizacion`)**:
   - Conserva el titular **"De horas de trabajo manual a minutos de ejecución."** aclarando expresamente que depende de cada proceso y su viabilidad técnica.
   - Reemplaza las 8 tarjetas extensas anteriores por un tablero editorial compacto (`623 px` de alto en escritorio, `1.299 px` en móvil) con una tira de flujo en 3 nodos (`Correo o formulario` → `Fila en planilla con fecha y motivo` → `Aviso al responsable asignado`) y 3 columnas concisas (`01 · Problema habitual`, `02 · Qué se automatiza`, `03 · Beneficio concreto`), con aclaración discreta de ejemplo ilustrativo.
4. **Unificación de jerarquía en Precios sin redundancia (`Pricing.jsx`)**:
   - Las 3 modalidades comerciales (`01 Soporte puntual`, `02 Abonos mensuales`, `03 Proyectos y Microsoft 365`) funcionan directamente como tarjetas selectoras interactivas (`<TabsTrigger>`), eliminando la duplicación entre resumen previo y pestañas.
   - **Reducción de altura en Precios**: de `2.632 px` a **`1.730 px`** en móvil (**`-902 px` / `-34%`**) y de `1.664 px` a **`1.029 px`** en escritorio (**`-635 px` / `-38%`**).
   - Todos los precios, planes de empresas, implementaciones Microsoft 365, condiciones y el destaque champagne `Pack Ahorro · Ahorrás $10.000` se mantienen intactos.
5. **Eliminación de apariencia ficticia y validación honesta en formularios (`Contact.jsx`, `TicketPage.jsx`, `mock.js`)**:
   - Se eliminaron todos los placeholders ficticios (`Juan Pérez`, `juan@email.com`, `11 1234-5678`) y se reemplazaron por indicaciones neutras (`Tu nombre`, `Correo electrónico`, `Teléfono o WhatsApp (opcional)`, `Motivo de la consulta (opcional)` / `Motivo de la solicitud`, `Contanos qué necesitás`).
   - En `/ticket`, la pantalla de confirmación únicamente se muestra cuando el backend responde con `success: true` y un `ticket_id` válido (`typeof response.data?.ticket_id === 'string' && response.data.ticket_id.trim()`), sin generar jamás números de ticket ficticios ni simular envíos reales.
   - Se depuró el lenguaje comercial en todo el sitio para eliminar promesas absolutas de velocidad (*"atención inmediata"*, *"en el día"*, *"en el acto"*), comunicando asistencia remota y visitas técnicas coordinadas según disponibilidad.

---

## 2. Comparativa de alturas (Antes vs. Después)

| Sección | Escritorio Antes (`1440px`) | Escritorio Después (`1440px`) | Variación Escritorio | Móvil Antes (`390px`) | Móvil Después (`390px`) | Variación Móvil |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Servicios + Automatización (`#servicios`)** | `4.197 px` | **`2.531 px`** | **`-1.666 px` (`-40%`)** | `6.245 px` | **`4.472 px`** | **`-1.773 px` (`-28%`)** |
| **Modalidades y precios (`#planes`)** | `1.664 px` | **`1.029 px`** | **`-635 px` (`-38%`)** | `2.632 px` | **`1.730 px`** | **`-902 px` (`-34%`)** |
| **Total combinado (`#servicios` + `#planes`)** | `5.861 px` | **`3.560 px`** | **`-2.301 px` (`-39%`)** | `8.877 px` | **`6.202 px`** | **`-2.675 px` (`-30%`)** |

---

## 3. Capturas reales — Escritorio (`1440×900`) y Móvil (`390×844`)

| Sección | Escritorio (`1440×900`) | Móvil (`390×844`) |
| --- | --- | --- |
| **Servicios (`#servicios`)** | ![Servicios Escritorio](preview-modernizacion/services-desktop.png) | ![Servicios Móvil](preview-modernizacion/services-mobile.png) |
| **Tablero de Automatización (`#automatizacion`)** | ![Automatización Escritorio](preview-modernizacion/automation-desktop.png) | ![Automatización Móvil](preview-modernizacion/automation-mobile.png) |
| **Modalidades y precios (`#planes`)** | ![Precios Escritorio](preview-modernizacion/pricing-particulares-desktop.png) | ![Precios Móvil](preview-modernizacion/pricing-particulares-mobile.png) |
| **Cómo trabajamos (`#como-funciona`)** | ![Cómo trabajamos Escritorio](preview-modernizacion/how-it-works-desktop.png) | ![Cómo trabajamos Móvil](preview-modernizacion/how-it-works-mobile.png) |
| **Por qué elegirnos (`#por-que-elegirnos`)** | ![Por qué elegirnos Escritorio](preview-modernizacion/why-us-desktop.png) | ![Por qué elegirnos Móvil](preview-modernizacion/why-us-mobile.png) |
| **Preguntas frecuentes (`#faq`)** | ![FAQ Escritorio](preview-modernizacion/faq-desktop.png) | ![FAQ Móvil](preview-modernizacion/faq-mobile.png) |
| **Contacto (`#contacto`)** | ![Contacto Escritorio](preview-modernizacion/contact-desktop.png) | ![Contacto Móvil](preview-modernizacion/contact-mobile.png) |
| **Tickets (`/ticket`)** | ![Tickets Escritorio](preview-modernizacion/ticket-desktop.png) | ![Tickets Móvil](preview-modernizacion/ticket-mobile.png) |
| **Footer** | ![Footer Escritorio](preview-modernizacion/footer-desktop.png) | ![Footer Móvil](preview-modernizacion/footer-mobile.png) |
