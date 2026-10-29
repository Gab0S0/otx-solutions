# Modernización Integral, Claridad Comercial y Experiencia de Usuario — OTX Solutions

Continuación sobre `main` (tras el merge del PR #1) en la rama `modernizacion-integral-2026-10`. Sin merge ni despliegue a producción.

## 1. Síntesis de la etapa actual (Comunicación comercial y UX)

Conservando intactos **Header**, **Hero**, la estética grafito/hielo/verde y la estructura de **Precios**, se refinó toda la comunicación comercial para que cualquier persona —tenga o no conocimientos informáticos— comprenda en segundos qué problemas resolvemos, cómo trabajamos y cómo contratarnos:

1. **Servicios en el idioma del cliente (`Services.jsx`, `mock.js`, `PremiumOffer.css`)**:
   - Cada servicio incorpora un **ícono Lucide discreto** (`Monitor`, `ShieldCheck`, `GraduationCap`, `Laptop`, `Wrench`, `Building2`, `Globe`, `Sparkles`), un título breve y una explicación cotidiana de 1 a 2 frases con ejemplos reales.
   - Se eliminó toda jerga técnica (`tenant`, `endpoint`, `MFA`, `deploy`, `infraestructura cloud`, `integraciones API`) de la vista principal; las especificaciones técnicas quedan exclusivamente dentro del panel desplegable de cada servicio.
   - **Soporte técnico remoto y presencial** se mantiene como servicio principal con el identificador `Principal`.
2. **Ampliación de servicios sin sobrecargar la página**:
   - **Visitas técnicas a coordinar**: integradas dentro de *Soporte técnico remoto y presencial* y en *Preguntas frecuentes*, aclarando asistencia a domicilio u oficinas para equipos, impresoras, redes e instalaciones según evaluación y confirmando disponibilidad, zona, traslado y presupuesto antes de asistir.
   - **Capacitación personalizada**: incorporada dentro de *Asistencia y aprendizaje* para enseñar a usar la computadora, Windows, Office, Excel, correo e inteligencia artificial a particulares, adultos mayores, profesionales y empresas, a ritmo propio y sin cursos cerrados.
3. **Equipos y asesoramiento cercano**:
   - Se explica de forma directa que ayudamos tanto a quien quiere elegir una notebook o armar una PC gamer según su presupuesto, como a quien necesita equipar una oficina completa o mejorar/reparar su computadora actual (SSD, memoria RAM, armado a medida y diagnóstico físico).
4. **Soluciones para negocios orientadas a beneficios**:
   - Presentadas bajo beneficios concretos (*Tu empresa organizada y segura*, *Páginas web y formularios comerciales*, *Inteligencia artificial y automatización*).
   - En el desplegable técnico se detallan las capacidades en **Microsoft 365** (Outlook, Teams, OneDrive, SharePoint), **Microsoft Entra** (accesos y verificación MFA), **Defender**, **Intune**, **Claude** y **Microsoft Copilot**, aclarando que se cotizan como proyectos a medida sujetos a compatibilidad, licencias y alcance acordado.
5. **Destaque sutil para "Pack 5 Asistencias" (`Pricing.jsx`, `PremiumOffer.css`)**:
   - Sin alterar precios, vigencia ni condiciones, se incorporó un acento sutil en tono champagne (`#E5D3B3`) con el identificador **`Pack Ahorro · Ahorrás $10.000`** para diferenciarlo visualmente de la asistencia individual sin recurrir a brillos exagerados ni llamarlo "Premium".
6. **Menos texto y mayor claridad en el resto de la página (`HowItWorks.jsx`, `WhyUs.jsx`, `FAQ.jsx`, `Contact.jsx`, `TicketPage.jsx`, `Footer.jsx`)**:
   - Tres pasos simples en *Cómo trabajamos*, cuatro compromisos claros en *Por qué elegirnos* y siete preguntas frecuentes en lenguaje llano (incluyendo soporte remoto, alcance de $20.000, visitas a domicilio/oficina, clases personalizadas, compra/mejora de PC, planes mensuales y proyectos a medida).

---

## 2. Evaluación comercial de Planes para Empresas (Informe consultivo — sin cambios aplicados en código)

Análisis de los planes actuales en `planesPymes` (**Empresa Inicial — $120.000/mes** y **Empresa Operativa — $180.000/mes**) tomando como referencia el valor de la **Asistencia Remota individual ($20.000)** y el **Pack 5 Asistencias ($90.000)**:

### 2.1. Diagnóstico de la estructura actual

| Indicador | Asistencia Individual | Pack 5 Asistencias | Empresa Inicial ($120.000/mes) | Empresa Operativa ($180.000/mes) |
| --- | --- | --- | --- | --- |
| **Asistencias incluidas** | 1 asistencia | 5 asistencias (90 días) |Hasta 3 asistencias / mes | Hasta 5 asistencias / mes |
| **Puestos cubiertos** | 1 equipo puntual | Libre / profesional | Hasta 3 puestos registrados | Hasta 6 puestos registrados |
| **Valor implícito por asistencia** | $20.000 | $18.000 | **$40.000** | **$36.000** |
| **Valor implícito por puesto cubierto** | — | — | **$40.000 / puesto** | **$30.000 / puesto** |
| **Asistencia adicional** | $20.000 | $20.000 | **$40.000** | **$40.000** |

### 2.2. Hallazgos clave para el cliente y para OTX Solutions

1. **Fricción de precio percibido frente al Pack 5 Asistencias**:
   - Un dueño de comercio o estudio pequeño que compara las pestañas *Personas* y *Empresas* nota rápidamente que **3 asistencias en Empresa Inicial cuestan $120.000/mes** ($40.000 c/u, no acumulables), mientras que **5 asistencias en el Pack Ahorro cuestan $90.000** ($18.000 c/u y duran 3 meses).
   - Si en *Empresa Inicial* no se percibe con claridad qué valor continuo recibe el negocio más allá de las 3 intervenciones reactivas (por ejemplo, prioridad de atención en horario laboral, relevamiento inicial de los 3 puestos e impresoras/red compartida, o control preventivo mensual), el cliente pequeño tiende a comprar asistencias sueltas o el Pack de $90.000 en lugar de suscribirse al abono mensual.
2. **Asimetría en el valor de la "Asistencia adicional con plan activo ($40.000)"**:
   - Actualmente figura que una asistencia adicional para un cliente con abono activo cuesta **$40.000**, es decir, **el doble que una asistencia suelta de $20.000**. Para quien ya paga un abono mensual, que el adicional sea más caro que la tarifa pública general genera confusión comercial, salvo que se aclare expresamente que corresponde a una *intervención prioritaria empresarial* o se alinee con un valor preferencial para abonados.
3. **Claridad de diferencias entre Empresa Inicial y Empresa Operativa**:
   - **Empresa Operativa ($180.000/mes)** tiene una relación precio/cobertura mucho más atractiva que *Empresa Inicial*: por un **50% más de inversión** ($180.000 vs. $120.000), duplica los puestos cubiertos (**6 puestos vs. 3**) y suma un **67% más de asistencias** (**5 vs. 3**), además de incluir prioridad y revisión mensual.
   - En cambio, *Empresa Inicial* queda muy cerca en precio pero sin incluir explícitamente prioridad ni revisión preventiva básica.
4. **Sostenibilidad operativa para el prestador**:
   - Con un tope claro de **1 hora por caso remoto**, puestos registrados de antemano y asistencias no acumulables, la carga máxima teórica es de **3 horas/mes en Inicial** y **5 horas/mes en Operativa**, lo cual es **altamente sostenible y rentable** siempre que se mantengan fuera del abono:
     - Las **visitas presenciales** (cotizadas aparte según zona, traslado y disponibilidad).
     - Las **implementaciones de infraestructura, seguridad, Microsoft 365, web o IA** (cotizadas como proyectos independientes).

### 2.3. Propuestas concretas para evaluar (sin aplicar hasta tu autorización)

- **Opción A — Fortalecer el valor percibido sin tocar precios ($120.000 / $180.000)**:
  1. Sumar en **Empresa Inicial ($120.000/mes)** el beneficio de *"Prioridad de atención en horario comercial"* y *"Registro técnico de los 3 puestos e impresoras de red para resolver más rápido sin empezar de cero cada vez"*. Así se justifica por qué un negocio elige el abono mensual frente al Pack de particulares.
  2. En **Empresa Operativa ($180.000/mes)**, destacar *"Chequeo preventivo mensual de rendimiento, actualizaciones y copias de seguridad en los 6 puestos"*, diferenciándolo como un plan proactivo (evita que el negocio se frene) y no solo reactivo.
  3. Aclarar en extras que las **visitas técnicas presenciales** se coordinan como adicional con prioridad de agenda para clientes con plan activo.
- **Opción B — Alinear el precio de la "Asistencia adicional con plan activo"**:
  - Revisar el extra *"Asistencia adicional con plan activo: $40.000"* para que tenga sentido frente a la asistencia individual ($20.000), ya sea bonificándolo respecto de una tarifa corporativa de urgencia o ajustándolo a un valor preferencial de abonado (por ejemplo, **$18.000 – $20.000** por sesión remota extra de hasta 1 hora).

---

## 3. Comparación visual Antes vs. Después

### Destaque "Pack Ahorro" en Precios (`1440×900` y `390×844`)

| Escritorio (`1440×900`) | Móvil (`390×844`) |
| --- | --- |
| ![Precios Particulares Escritorio](preview-modernizacion/pricing-particulares-desktop.png) | ![Precios Particulares Móvil](preview-modernizacion/pricing-particulares-mobile.png) |

### Secciones en Escritorio (`1440×900`)

| Sección | Antes | Después |
| --- | --- | --- |
| **Servicios** | ![Antes Servicios escritorio](preview-modernizacion/before-services-desktop.png) | ![Después Servicios escritorio](preview-modernizacion/services-desktop.png) |
| **Cómo trabajamos** | ![Antes Cómo trabajamos escritorio](preview-modernizacion/before-how-it-works-desktop.png) | ![Después Cómo trabajamos escritorio](preview-modernizacion/how-it-works-desktop.png) |
| **Por qué elegirnos** | ![Antes Por qué elegirnos escritorio](preview-modernizacion/before-why-us-desktop.png) | ![Después Por qué elegirnos escritorio](preview-modernizacion/why-us-desktop.png) |
| **Preguntas frecuentes** | ![Antes FAQ escritorio](preview-modernizacion/before-faq-desktop.png) | ![Después FAQ escritorio](preview-modernizacion/faq-desktop.png) |
| **Contacto** | ![Antes Contacto escritorio](preview-modernizacion/before-contact-desktop.png) | ![Después Contacto escritorio](preview-modernizacion/contact-desktop.png) |
| **Tickets (`/ticket`)** | ![Antes Tickets escritorio](preview-modernizacion/before-ticket-desktop.png) | ![Después Tickets escritorio](preview-modernizacion/ticket-desktop.png) |
| **Footer** | ![Antes Footer escritorio](preview-modernizacion/before-footer-desktop.png) | ![Después Footer escritorio](preview-modernizacion/footer-desktop.png) |

### Secciones en Móvil (`390×844`)

| Sección | Antes | Después |
| --- | --- | --- |
| **Servicios** | ![Antes Servicios móvil](preview-modernizacion/before-services-mobile.png) | ![Después Servicios móvil](preview-modernizacion/services-mobile.png) |
| **Cómo trabajamos** | ![Antes Cómo trabajamos móvil](preview-modernizacion/before-how-it-works-mobile.png) | ![Después Cómo trabajamos móvil](preview-modernizacion/how-it-works-mobile.png) |
| **Por qué elegirnos** | ![Antes Por qué elegirnos móvil](preview-modernizacion/before-why-us-mobile.png) | ![Después Por qué elegirnos móvil](preview-modernizacion/why-us-mobile.png) |
| **Preguntas frecuentes** | ![Antes FAQ móvil](preview-modernizacion/before-faq-mobile.png) | ![Después FAQ móvil](preview-modernizacion/faq-mobile.png) |
| **Contacto** | ![Antes Contacto móvil](preview-modernizacion/before-contact-mobile.png) | ![Después Contacto móvil](preview-modernizacion/contact-mobile.png) |
| **Tickets (`/ticket`)** | ![Antes Tickets móvil](preview-modernizacion/before-ticket-mobile.png) | ![Después Tickets móvil](preview-modernizacion/ticket-mobile.png) |
| **Footer** | ![Antes Footer móvil](preview-modernizacion/before-footer-mobile.png) | ![Después Footer móvil](preview-modernizacion/footer-mobile.png) |
