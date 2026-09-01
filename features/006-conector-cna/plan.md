# 006 · Conector Especializado de Informes CNA — Plan Técnico

_Cómo se implementa técnicamente lo especificado en `spec.md`, respetando `constitution/tech-stack.md` y `constitution/mission.md`._

## Enfoque Arquitectural

Se **extiende el motor de scraping existente** (`src/lib/scraper/`) en lugar de crear un módulo paralelo, reutilizando `axios` + `cheerio`, `fetchHtml`, `cleanText`, `normalizeUrl`, `extractDate` y `delay`. Se añade un conector dedicado al CNA con tres piezas:

1. **Fuente CNA** registrada en `sources.ts` apuntando al listado de investigaciones, con selectores afinados a la estructura WordPress/Elementor del portal y `type: 'informe'`.
2. **Parsing extendido** que, además de los metadatos base (`title`, `date`, `summary`, `url`), captura el **enlace al PDF** y detecta **candidatos de montos** (Lempiras/USD) mediante expresiones regulares.
3. **Endpoint API** que invoca la ingesta del CNA, consolida cada entrada como `Fuente` en `src/lib/db/store.ts` (deduplicando por URL) y devuelve el reporte (nuevas, duplicadas, montos detectados).

El conector respeta el flujo `ScrapeResult` → `createFuente` ya definido en `run/route.ts`, reutilizando la deduplicación existente para no duplicar URLs.

## Modelado de Dominio e Integración

- **Entidades / Nodos:** no se modelan nodos de grafo en esta feature. La unidad de dominio es la `Fuente` (tipo `SourceType`) con un nuevo valor `'informe'` para distinguir las investigaciones del CNA de noticias/oficial.
- **Conexiones / Aristas:** no aplica (sin grafo). La trazabilidad se mantiene vía `Fuente.url` → informe oficial del CNA.
- **Métricas de Perjuicio:** detección de **candidatos de monto** por regex sobre el contenido/resumen (`L\s?\d`, `LPS`, `USD`, `US\$$`, `Q\s?\d`, `$\d`), reportados como array auxiliar por entrada (sin consolidar aún, eso es `008`).
- **Fuentes:** nuevas entradas `Fuente` con `confiabilidad: 0.95` y `tipo: 'informe'`, enlazadas a `https://www.cna.hn/`.

### Tipos nuevos / modificados

- `src/types/corruption.ts`: ampliar `SourceType` con `'informe'`.
- `src/lib/scraper/types.ts`: añadir campo opcional `pdfUrl?: string` y `montosDetectados?: string[]` a `ScrapeResult` (sin romper el resto del código).
- `src/lib/scraper/cna.ts` (nuevo): funciones `scrapeInformesCna()` y parsing especializado + `detectMontos()`.

## Pasos de Implementación

1. **Datos / Persistencia:**
   - Registrar la fuente CNA en `src/lib/scraper/sources.ts` (`id: 'cna'`, `type: 'informe'`, `listUrl: 'https://www.cna.hn/investigaciones/'`, `rateLimitMs: 4000`).
   - Ampliar `SourceType` en `src/types/corruption.ts` con `'informe'`.

2. **Lógica / API:**
   - Crear `src/lib/scraper/cna.ts` con parsing especializado que detecta el enlace PDF y los montos candidatos (regex Lempiras/USD).
   - Extender `ScrapeResult` en `types.ts` con `pdfUrl?` y `montosDetectados?`.
   - Exportar el conector desde `src/lib/scraper/index.ts`.
   - Crear/actualizar API en `src/app/api/scrape/run/route.ts` para que acepte `cna` como `sourceId`, usando `confiabilidad: 0.95` y `tipo: 'informe'` al consolidar en `store.ts`. (La consolidación genérica ya deduplica por URL.)

3. **Componentes UI:**
   - No se requiere UI nueva en esta feature; la pantalla de scraping existente o el selector de fuentes mostrará "Consejo Nacional Anticorrupción" como fuente disponible.
   - (Opcional) Enriquecer visualización de fuentes para marcar `[ INFORME CNA ]`.

4. **Pruebas y Validación:**
   - Tests unitarios de `detectMontos` y del parsing de un HTML de ejemplo del CNA (mock de `fetchHtml`).
   - Ejecutar `npm test` y `npm run lint`.

## Decisiones Técnicas

- **Extender el motor actual en lugar de un scraper separado:** el portal CNA ya encaja con el patrón `ScrapeSource`/`scrapeSource` (listado → artículos). Mantener un solo motor reduce duplicación y alinea con `tech-stack.md`. Se descartó crear un microservicio independiente por ser sobre-ingeniería para una ingesta de listado.
- **`tipo: 'informe'` como nuevo `SourceType`:** permite distinguir investigaciones del CNA de meras noticias, elevando su peso de confiabilidad e identificándolas como la base documental de los casos emblemáticos.
- **Metadata-only del HTML (no parsing PDF):** el costo de extraer el PDF supera el beneficio en esta fase. Se captura el enlace PDF y el resumen del HTML; la indexación profunda del contenido queda para `011`.
- **Detección de montos por regex conservadora:** solo marca candidatos para revisión humana; evita inventar cifras (cumple "no alucinar datos" de AGENTS.md).

## Riesgos y Mitigaciones

- **Cambio de estructura del portal CNA (WordPress/Elementor):** los selectores pueden quedar obsoletos → Mitigación: fallo controlado con respuesta estructurada (`500`/mensaje claro) y `rateLimitMs`; no se corrompen datos existentes. El código se mantiene aislado en `cna.ts` para ajuste selectivo.
- **Desduplicación de informes ya indexados:** reutilizar la deduplicación por URL del `store` evita registrar dos veces el mismo informe.
- **Antigüedad de cifras / fraude de monto:** la detección por regex puede arrojar falsos positivos → Mitigación: los montos se reportan como *candidatos* para validación, no como cifras finales del perjuicio.
