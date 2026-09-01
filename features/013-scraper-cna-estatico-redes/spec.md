# 013 · Scraper CNA Estático + 5 Redes de Casos Emblemáticos

**Estado:** en desarrollo
**Caso / Módulo:** Scraping estático del CNA, finalización de 5 redes de corrupción y enriquecimiento de KPIs con indicadores institucionales.

## Qué hace

Adapta el pipeline de scraping del [Consejo Nacional Anticorrupción (CNA)](https://www.cna.hn/) al nuevo **stack estático** (GitHub Pages), finaliza el conjunto de **5 redes de corrupción** de casos emblemáticos documentados y amplía el dashboard de KPIs con indicadores institucionales del CNA.

### 1. Scraping estático del CNA
- Proporciona un **script de línea de comandos** (`npm run scrape`) que ejecuta el conector CNA existente (`scrapeInformesCna`) y escribe los resultados como **archivos JSON versionados** en `src/data/scraped/`.
- Los JSON generados son consumidos por el frontend en *build time* (import directo de datos estáticos), lo que permite servir los informes del CNA en GitHub Pages **sin servidor en runtime**.
- Documenta que la ejecución del scraping es una tarea manual / de CI que regenera los datos, no un endpoint HTTP.

### 2. Cinco redes de corrupción finalizadas
Se consolida el catálogo de casos emblemáticos a **5 redes** con datos verificables:

| Caso | Monto (Lempiras) | Período | Fuente principal |
|------|------------------|---------|------------------|
| Desfalco al IHSS | L.6,399M | 2010–2014 | CNA / prensa |
| Hospitales Móviles | L.1,174M | 2020 | MP / ASJ |
| Caso Pandora | L.282M | 2013–2018 | MACCIH / UFECIC |
| **Caso PRAF** | **L.96,976,218** | 2010–2014 | MP / CNA |
| **Caso Rosa de Lobo** | **L.16M+** | 2011–2015 | MACCIH-OEA / MP / CNA |

Los dos nuevos casos (PRAF y Rosa de Lobo) se modelan con su red de actores, conexiones, montos vinculados y fuentes públicas verificables.

### 3. Revisión de la información del sitio CNA
- **Investigaciones**: captura en el scraping de los informes emblemáticos recientes y de las investigaciones históricas relevantes a los casos del catálogo.
- **KPIs / indicadores**: añade al dashboard indicadores institucionales del CNA (perjuicio económico identificado, casos presentados, judicializados, en impunidad, veedurías, instituciones acompañadas) con fuente a `/opca` y `/indicadores`, sin inventar cifras.

## Por qué

Tras el cambio a **stack estático** (feature "static export" para GitHub Pages), el frontend ya no dispone de runtime de servidor: las API routes fueron eliminadas. El motor de scraping (`src/lib/scraper/`) quedó **sin punto de integración**: no hay forma de ejecutarlo ni de persistir sus resultados. Esta feature lo reorienta a un **script que genera datos estáticos versionados**.

Además, el catálogo de casos emblemáticos se limita a 3 redes (IHSS, Hospitales Móviles, Pandora). Incorporar **PRAF** y **Rosa de Lobo** —ambos con requerimientos fiscales y sentencias documentadas por el MP y la MACCIH-OEA— completa un panorama de 5 casos de alto impacto, y enriquece el dashboard de KPIs con la dimensión institucional de la lucha anticorrupción que el CNA monitorea.

## Fuentes Públicas de Respaldo

- **CNA — Informes e investigaciones:** `https://www.cna.hn/investigaciones/` y `https://www.cna.hn/informes/`
- **CNA — Página del caso Rosa de Lobo:** `https://www.cna.hn/la-prensa-cronologia-de-las-investigaciones-contra-rosa-de-lobo/`
- **CNA — Investigación PRAF (sobrevaloración):** `https://www.cna.hn/praf-sobrevaloracion-de-contratos-por-servicios-de-capacitacion/`
- **MACCIH-OEA — Comunicado "Caja chica de la Dama":** `https://www.oas.org/es/sap/dsdme/maccih/new/docs/MCH-001.18-MACCIH-COMUNICADO-DE-PRENSA-caso-caja-chica.pdf`
- **Ministerio Público — PRAF:** `https://www.mp.hn/publicaciones/requerimiento-fiscal-contra-estructura-que-opero-en-el-praf-por-desvio-de-l-96-9-millones-destinados-para-capacitar-en-oficios-y-carreras-tecnicas-a-jovenes-y-mujeres-en-extrema-pobreza/`
- **Ministerio Público — Caja Chica de la Dama:** `https://www.mp.hn/publicaciones/mp-logra-declaratoria-de-culpabilidad-en-el-caso-caja-chica-de-la-dama/`
- **El Heraldo — PRAF:** `https://www.elheraldo.hn/honduras/requerimiento-fiscal-red-desvio-96-9-millones-lempiras-praf-NC24408270`
- **CNA — Datos OPCA / indicadores:** `https://www.cna.hn/opca/` y `https://www.cna.hn/indicadores/`

## Criterios de Aceptación

- [ ] Existe un script ejecutable `npm run scrape` que corre el conector CNA y genera archivos JSON versionados bajo `src/data/scraped/`.
- [ ] Los JSON generados son importables por el frontend (build time), sin llamadas HTTP en runtime, y el sitio sigue compilando a export estático (`output: 'export'`).
- [ ] `src/data/redes/` contiene 5 casos emblemáticos: IHSS, Hospitales Móviles, Pandora, **PRAF** y **Rosa de Lobo**, cada uno con `CasoRed`, actores y conexiones tipados (`ActorRed`, `ConexionRed`) y con `fuente_url` verificable hacia CNA/MP/MACCIH/prensa.
- [ ] Los datos de los casos PRAF y Rosa de Lobo provienen de fuentes públicas reales (no inventadas), con montos y estado procesal documentados.
- [ ] El agregador `src/data/redes/index.ts` expone los 5 casos (selector y grafo `/redes` los muestran correctamente).
- [ ] El dashboard de KPIs incluye indicadores institucionales del CNA con fuente a `https://www.cna.hn/opca/` y `https://www.cna.hn/indicadores/`, sin cifras inventadas (se usan las publicadas por el CNA).
- [ ] Se añaden tests que cubren los nuevos datos (PRAF y Rosa de Lobo) y el script de scraping (si es testeable), sin romper los existentes.
- [ ] `npm test` y `npm run lint` pasan tras los cambios; `npm run build` genera el export estático sin errores de tipado ni de datos.

## Fuera de Alcance

- **Persistencia en PostgreSQL** — se mantiene el esquema relacional pero el scraping y las redes se sirven desde datos estáticos (coherente con el stack GitHub Pages).
- **Autenticación / panel admin sobre los nuevos casos** — la feature 007 ya aporta edición en memoria; aquí solo se añaden datos al catálogo estático.
- **Descarga o parsing del contenido de los PDFs del CNA** — se capturan metadatos (URL, título, fecha, montos detectados), no el texto interno de los PDF.
- **Backend RAG / chatbot** — intacto; la feature se limita al frontend estático y sus datos.
- **KPIs históricos adicionales fuera del CNA** — solo se añade la dimensión institucional CNA sin rehacer la serie socioeconómica existente.
