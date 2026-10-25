# Modernización Integral y Refinamiento de Experiencia — OTX Solutions

Continuación sobre `main` (tras el merge del PR #1) en la rama `modernizacion-integral-2026-10`. Sin merge ni despliegue a producción.

## 1. Síntesis del refinamiento final

Conservando intactos **Header**, **Hero**, el fondo premium y **Precios**, se aplicó un refinamiento de claridad editorial y reducción de fricción visual en escritorio y móvil:

1. **Servicios (`Services.jsx`, `mock.js`)**:
   - Se mantienen las 3 categorías y los 7 servicios con **Soporte Técnico Remoto** como servicio principal.
   - Títulos concisos sin truncamientos: **Soporte Técnico Remoto**, **Seguridad y optimización**, **Microsoft 365**, **Asesoramiento y equipamiento**, **Armado y reparación**, **Web y formularios**, **Automatizaciones e IA**.
   - Se eliminó la repetición textual entre la bajada general, la introducción de cada categoría y el subtítulo de cada fila. Los detalles completos (notebooks, PC gamer, oficinas completas, monitores, periféricos, reparaciones según evaluación y proyectos a medida) permanecen dentro del desplegable.
2. **Cómo trabajamos (`HowItWorks.jsx`)**:
   - Tres pasos directos (**01 Escribinos**, **02 Definimos el alcance**, **03 Resolvemos**) con un único CTA principal a WhatsApp y accesos secundarios discretos a Contacto y Tickets.
3. **Por qué elegirnos (`WhyUs.jsx`)**:
   - Una sola composición limpia con cuatro argumentos concretos y verificables.
   - Se eliminó la duplicación entre el listado lateral y los pilares, así como la promesa no autorizada de revisión de 48 horas. Sin estadísticas ni tiempos inventados.
4. **Preguntas frecuentes (`FAQ.jsx`)**:
   - Siete preguntas clave enfocadas en soporte remoto y seguridad, alcance de 1 hora, extensiones/evaluación física, planes mensuales empresariales, asesoramiento/armado/reparación de hardware, proyectos web/IA a medida y Microsoft 365.
   - Se retiraron preguntas no autorizadas o sobre recuperación de discos dañados.
5. **Contacto (`Contact.jsx`)**:
   - WhatsApp como canal protagonista en la columna principal.
   - Formulario simplificado para celular (Nombre, Email, Teléfono opcional, Asunto autocompletable y Mensaje), con indicador visual cuando se llega desde un servicio o plan (`Seleccionado: ...`) y resolución automática de `tipo` y `asunto` respetando el contrato de FastAPI (`POST /api/tickets`).
6. **Tickets (`TicketPage.jsx`)**:
   - Encabezado móvil despejado (`otx.` a la izquierda, `WhatsApp` a la derecha, y `Volver al inicio` ubicado sobre la introducción del formulario).
   - Selectores sin truncamientos (`white-space: normal`) y prellenado automático de `servicio`, `plan`, `tipo` y `asunto` desde parámetros URL.
7. **Footer (`Footer.jsx`)**:
   - Identidad unificada del wordmark `otx.` con su punto verde (`#8FE3C0`).
   - Disposición en dos columnas en móvil para `Secciones` y `Contacto`, reduciendo su altura vertical en un **42%**.

---

## 2. Métricas de reducción de altura por sección

Comparación medida en Chromium entre la primera versión modernizada y el refinamiento final:

| Sección | Escritorio Antes (`1440×900`) | Escritorio Después (`1440×900`) | Variación Escritorio | Móvil Antes (`390×844`) | Móvil Después (`390×844`) | Variación Móvil |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Servicios** *(con 1 fila abierta)* | 1478 px | **1451 px** | -27 px (**-2%**) | 2170 px | **1925 px** | -245 px (**-11%**) |
| **Cómo trabajamos** | 667 px | **565 px** | -102 px (**-15%**) | 1221 px | **898 px** | -323 px (**-26%**) |
| **Por qué elegirnos** | 776 px | **658 px** | -118 px (**-15%**) | 1606 px | **957 px** | -649 px (**-40%**) |
| **Preguntas frecuentes** *(1 abierta)* | 1220 px | **749 px** | -471 px (**-39%**) | 1870 px | **1173 px** | -697 px (**-37%**) |
| **Contacto** | 970 px | **727 px** | -243 px (**-25%**) | 1992 px | **1273 px** | -719 px (**-36%**) |
| **Footer** | 471 px | **397 px** | -74 px (**-16%**) | 893 px | **518 px** | -375 px (**-42%**) |
| **Tickets (`/ticket`)** | 1129 px | **1038 px** | -91 px (**-8%**) | 1342 px | **1247 px** | -95 px (**-7%**) |
| **Total secciones landing (sin Hero/Precios)** | 5582 px | **4547 px** | **-1035 px (-19%)** | 9752 px | **6744 px** | **-3008 px (-31%)** |

En móvil se redujo el desplazamiento vertical de estas secciones en **3.008 píxeles (-31%)** sin sacrificar tamaño tipográfico, contraste ni legibilidad.

---

## 3. Comparación visual Antes vs. Después

### Escritorio (`1440×900`)

| Sección | Antes del refinamiento | Después del refinamiento |
| --- | --- | --- |
| **Servicios** | ![Antes Servicios escritorio](preview-modernizacion/before-services-desktop.png) | ![Después Servicios escritorio](preview-modernizacion/services-desktop.png) |
| **Cómo trabajamos** | ![Antes Cómo trabajamos escritorio](preview-modernizacion/before-how-it-works-desktop.png) | ![Después Cómo trabajamos escritorio](preview-modernizacion/how-it-works-desktop.png) |
| **Por qué elegirnos** | ![Antes Por qué elegirnos escritorio](preview-modernizacion/before-why-us-desktop.png) | ![Después Por qué elegirnos escritorio](preview-modernizacion/why-us-desktop.png) |
| **Preguntas frecuentes** | ![Antes FAQ escritorio](preview-modernizacion/before-faq-desktop.png) | ![Después FAQ escritorio](preview-modernizacion/faq-desktop.png) |
| **Contacto** | ![Antes Contacto escritorio](preview-modernizacion/before-contact-desktop.png) | ![Después Contacto escritorio](preview-modernizacion/contact-desktop.png) |
| **Tickets (`/ticket`)** | ![Antes Tickets escritorio](preview-modernizacion/before-ticket-desktop.png) | ![Después Tickets escritorio](preview-modernizacion/ticket-desktop.png) |
| **Footer** | ![Antes Footer escritorio](preview-modernizacion/before-footer-desktop.png) | ![Después Footer escritorio](preview-modernizacion/footer-desktop.png) |

### Móvil (`390×844`)

| Sección | Antes del refinamiento | Después del refinamiento |
| --- | --- | --- |
| **Servicios** | ![Antes Servicios móvil](preview-modernizacion/before-services-mobile.png) | ![Después Servicios móvil](preview-modernizacion/services-mobile.png) |
| **Cómo trabajamos** | ![Antes Cómo trabajamos móvil](preview-modernizacion/before-how-it-works-mobile.png) | ![Después Cómo trabajamos móvil](preview-modernizacion/how-it-works-mobile.png) |
| **Por qué elegirnos** | ![Antes Por qué elegirnos móvil](preview-modernizacion/before-why-us-mobile.png) | ![Después Por qué elegirnos móvil](preview-modernizacion/why-us-mobile.png) |
| **Preguntas frecuentes** | ![Antes FAQ móvil](preview-modernizacion/before-faq-mobile.png) | ![Después FAQ móvil](preview-modernizacion/faq-mobile.png) |
| **Contacto** | ![Antes Contacto móvil](preview-modernizacion/before-contact-mobile.png) | ![Después Contacto móvil](preview-modernizacion/contact-mobile.png) |
| **Tickets (`/ticket`)** | ![Antes Tickets móvil](preview-modernizacion/before-ticket-mobile.png) | ![Después Tickets móvil](preview-modernizacion/ticket-mobile.png) |
| **Footer** | ![Antes Footer móvil](preview-modernizacion/before-footer-mobile.png) | ![Después Footer móvil](preview-modernizacion/footer-mobile.png) |

---

## 4. Validación funcional y de prellenado

- **Diagnóstico de `prefilledAsunto`**: En la corrida previa el script de prueba ejecutaba `trigger.click()` y `btn.click()` dentro de un mismo tick síncrono antes de que React 18 montara el panel y aplicara `setFormData`. Al aguardar el ciclo de renderizado de React, `prefilledAsunto` registra correctamente `"Consulta sobre: Asesoramiento y equipamiento"`, muestra el indicador visual `Seleccionado: Asesoramiento y equipamiento` y enfoca el campo `#nombre`.
- **Envío de tickets (`POST /api/tickets`)**: Comprobado tanto desde `#contacto` (`canal: "Landing"`) como desde `/ticket` (`canal: "TicketWeb"`), validando el esquema `TicketCreate` del backend FastAPI y mostrando la pantalla de confirmación con número de ticket ([checks.json](preview-modernizacion/checks.json)).
- **Compilación**: `143,45 kB JS gzip` y `13,25 kB CSS gzip`, sin errores ni desbordamiento horizontal en 7 tamaños de pantalla (`320×740` a `1920×1080`).
