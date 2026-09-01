# 006 · Conector Especializado de Informes CNA

**Estado:** implementado ✅
**Caso / Módulo:** Conector CNA (https://www.cna.hn/)

## Qué hace

Extiende el motor de scraping existente (`src/lib/scraper/`) con un conector especializado que ingesta y **indexa de forma semiautomática los informes de investigación del Consejo Nacional Anticorrupción (CNA)**. El conector:

- Descubre las investigaciones publicadas en el portal del CNA (secciones *Publicaciones / Investigaciones*, por ejemplo la página `https://www.cna.hn/investigaciones/` y las entradas de la sección Investigaciones de `https://www.cna.hn/`).
- Extrae metadatos de cada informe: **título**, **fecha de publicación**, **resumen/descripción**, **enlace al PDF descargable** y **URL canónica**.
- Clasifica automáticamente la entrada como `tipo: 'informe'` (frente a `noticia`/`oficial`) y como fuente de **alta confiabilidad** (`confiabilidad` elevada, p. ej. `0.95`), reconociendo que el CNA es la fuente prioritaria del proyecto.
- Detecta textos candidatos a **montos de perjuicio económico** (cifras en Lempiras `L`, `LPS`, `Q`, o USD `$`) y a **lineamientos/denuncias** dentro del contenido, para facilitar su posterior cuantificación y trazabilidad.

La persona analista podrá, desde la aplicación, invocar el conector (endpoint API), obtener un listado de informes indexados y revisar cuáles se han consolidado como `Fuente` verificable en el almacén (`src/lib/db/store.ts`).

## Por qué

El CNA es la **fuente primaria y de mayor autoridad** de los casos emblemáticos del proyecto (IHSS, Hospitales Móviles, Pandora). Hasta ahora estas investigaciones se incorporan de forma **manual y estática** en `src/data/redes/`, lo que no escala conforme el CNA publica nuevos informes. Este conector permite:

- **Automatizar la detección** de nuevas investigaciones del CNA sobre corrupción en Honduras.
- **Mantener trazabilidad rigurosa**: cada `Fuente` enlaza al informe original, cumpliendo el principio "sin datos no verificados" (AGENTS.md).
- Alimentar features posteriores (Panel Admin `007`, Calculadora de Perjuicio `008`, Búsqueda RAG `011`) con metadatos confiables y montos detectados.

## Fuentes Públicas de Respaldo

- **Fuente 1:** Portal oficial del CNA — Investigaciones: `https://www.cna.hn/investigaciones/` (y sección Investigaciones del inicio `https://www.cna.hn/`).
- **Fuente 2:** Publicaciones e informes del CNA: `https://www.cna.hn/informes/` (descargables en PDF).
- **Fuente 3:** Comunicados y notas de prensa oficiales del CNA: `https://www.cna.hn/sala-de-prensa/comunicados-y-notas-de-prensa/`.

## Criterios de Aceptación

- [x] El conector ingesta los informes/investigaciones del CNA desde su listado y devuelve entradas con título, fecha, resumen, URL y enlace a PDF.
- [x] Las entradas del CNA se indexan como `Fuente` con `tipo: 'informe'` y `confiabilidad: 0.95` en `src/lib/db/store.ts`, sin duplicar URLs ya existentes.
- [x] Se detectan candidatos de montos de perjuicio (Lempiras/USD) en el contenido de los informes y se reportan junto a cada entrada.
- [x] Manejo de errores: si el portal del CNA no responde o cambia su estructura, el conector falla de forma controlada (respuesta estructurada con error) y respeta `rateLimitMs`.
- [x] Existe un endpoint API que permite disparar el proceso y listar las fuentes CNA indexadas.
- [x] `npm run lint` y `npm test` pasan tras los cambios.

## Fuera de Alcance

- **Parsing completo del contenido PDF** de cada informe (solo se extraen metadatos y resumen del HTML; la extracción profunda del PDF se aborda en el módulo RAG `011`).
- **Ingesta automática programada** (cron/CI) — en esta fase el conector se invoca bajo demanda desde la API.
- **Cuantificación automática del perjuicio** — el conector solo **detecta** montos candidatos; la conversión a impacto social se consolida en `008`.
- Clasificación automática de actores/redes a partir del informe (sigue siendo una tarea de análisis humano verificada).
