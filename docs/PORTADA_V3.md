# Portada V3 — cambio de fondo

Propuesta para el PR #1, sobre `mejora-comercial-2026-10`. Pendiente de aprobación visual; sin merge ni despliegue.

## Dirección

Una superficie negra mate en primer plano, con una curva continua, textura discreta y luz fría en el borde. El volumen se sitúa en la periferia para dejar despejado el centro. Sustituye las franjas diagonales de la V2.

El recurso fue generado originalmente para esta tarea, no descargado de una biblioteca ni tomado de Kolpu. No es una fotografía documental. No se incorporan recursos de terceros, partículas, humo, nebulosas, video, animación o nuevos efectos de JavaScript.

Se incluyen dos derivados WebP de esa misma imagen: escritorio (1536×1024, unos 28 kB) y móvil (640×1024, unos 25 kB, recorte lateral). Cada viewport solicita una sola variante. Las imágenes se sirven desde la propia aplicación con nombre versionado por el build. Fondo sólido `#04070C` mientras carga la imagen; sombras y velo oscuro mantienen la paleta y protegen la lectura. Sin nuevas dependencias.

## Capturas reales

### Escritorio · 1440×900

![V3 de escritorio](preview-v3/desktop.png)

### Móvil · 390×844

![V3 móvil](preview-v3/mobile.png)

Capturas de la compilación local con Playwright, con la fuente y el fondo cargados. [V2 para comparar](PORTADA_V2.md).

## Alcance protegido

El único archivo de aplicación modificado es `PremiumIntro.css`, limitado al fondo y su velo. Se añaden dos imágenes. Header, Hero, tipografía, tamaños, posición, logo, textos, precios, CTA, enlaces y demás secciones conservan sus fuentes y valores de la V2.

Una comprobación contra una captura de datos previa de V2 verifica igualdad exacta de posiciones, dimensiones, texto, enlaces, tipografía y colores de los elementos visibles en **diez tamaños**. Resultados: [layout-check.json](preview-v3/layout-check.json).

## Validación

- Compilación de producción correcta: `REACT_APP_BACKEND_URL=http://127.0.0.1:8001 npm --prefix frontend run build`. El bundle JavaScript conserva el mismo hash y peso de V2 (149,90 kB gzip). `git diff --check` correcto.
- Responsive en Chromium: 320×740, 375×667, 390×844, 768×1024, 844×390, 1280×720, 1366×768, 1440×900, 1920×1080 y 2560×1440. Sin desbordamiento horizontal, scroll natural y contenido conservados. Menú móvil, Escape, foco y navegación comprobados.
- Axe sobre header y portada: 0 infracciones automáticas en los diez tamaños. El fondo es decorativo, permanece oculto a lectores y no recibe eventos ni foco. No tiene movimiento.
- Contraste adicional medido sobre los píxeles del fondo renderizado en escritorio y móvil, ocultando únicamente los textos para muestrear lo que tienen debajo. Se usa el punto más luminoso dentro de cada caja de texto, un límite conservador. El mínimo observado fue **6,16:1**; supera tanto 3:1 para títulos grandes como 4,5:1 para texto normal. El CTA conserva sus colores opacos de V2. Esto complementa Axe, que no evalúa por sí solo cada píxel de imágenes de fondo.
- Resultados: [responsive](preview-v3/checks.json), [contraste](preview-v3/contrast-check.json).

Las pruebas móviles usan viewports de Chromium, no dispositivos Safari/iOS físicos. La auditoría se limita a este cambio; no certifica la accesibilidad de todo el sitio. No se tocaron los pendientes anteriores de otras secciones.

## Rendimiento móvil

Lighthouse sobre la misma compilación local y el mismo servidor de comprobación, sin caché/compresión de producción:

| Medida | V2 | V3 |
| --- | --- | --- |
| Rendimiento | 75/100 | 75/100 |
| FCP | 1,1 s | 1,1 s |
| LCP | 4,4 s | 4,6 s |
| TBT | 410 ms | 370 ms |
| CLS | 0 | 0 |

Son mediciones puntuales de laboratorio sujetas a variación, no métricas de visitantes. Se mantiene el puntaje móvil previo con el nuevo recurso visual. La auditoría global de accesibilidad conserva 92/100 y los pendientes anteriores fuera del alcance de este cambio. [Resumen medido](preview-v3/lighthouse-summary.json).

La captura de recursos de la prueba móvil confirma una única imagen WebP de unos 25 kB; no se descarga también la variante de escritorio. El velo móvil es más oscuro para preservar el contraste de la composición existente.
