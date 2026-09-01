# 013 · Scraper CNA Estático + 5 Redes — Plan Técnico

_Cómo se implementa técnicamente lo especificado en `spec.md`, respetando `constitution/tech-stack.md` y `constitution/mission.md`._

## Enfoque Arquitectural

La feature se acopla al **stack estático** ya adoptado (GitHub Pages, `output: 'export'`, sin API routes). Por tanto:

1. **Scraping → script de build** (`npm run scrape`): un script Node/TS que invoca el conector CNA existente (`scrapeInformesCna` de `src/lib/scraper/cna.ts`), serializa los `ScrapeResult[]` a JSON y los escribe versionados en `src/data/scraped/<fecha>.json`. El frontend importa esos JSON directamente en *build time* (no hay runtime). El script se ejecuta manualmente o en CI.

2. **Redes → datos estáticos en `src/data/redes/`**: se añaden dos casos nuevos (**PRAF** y **Rosa de Lobo**) siguiendo exactamente el patrón de los archivos existentes (`ihss.ts`, `hospitales-moviles.ts`, `pandora.ts`) y de los tipos `CasoRed`/`ActorRed`/`ConexionRed`. El agregador `src/data/redes/index.ts` se actualiza para incluir los 5 casos; la vista `/redes` (que ya lee de `@/data/redes` directamente) los muestra sin cambios de UI.

   **Hallazgo clave (diseño del scraping):** la URL `/investigaciones/` del CNA es un **hub de enlaces por año** y cada página anual renderiza su grid de informes con **JavaScript** (Elementor/ANWP Post Grid). El parseo de HTML estático (`scrapeInformesCna`, selectores `article`/`.elementor-post`) devuelve **0 resultados** en el sitio actual. Para lograr scraping funcional se añade `scrapeInformesCnaRest()` que consume la **WordPress REST API** (`https://www.cna.hn/wp-json/wp/v2/posts`), filtrando por la categoría raíz **207 «Investigación»**. Esta vía es fiable (no depende del renderizado JS), devuelve título, link, fecha, extracto, categorías y el **PDF del informe** incrustado en el contenido, y extrae los 47 informes actuales.

3. **KPIs → indicadores institucionales CNA**: se añaden indicadores al catálogo `src/data/kpi/indicators.ts` y sus series a `src/data/kpi/corruption.ts` (área `general`), con fuentes a `/opca` e `/indicadores` del CNA, usando **únicamente cifras publicadas** (perjuicio económico identificado, casos presentados, judicializados, en impunidad, instituciones acompañadas, recomendaciones presentadas).

## Modelado de Dominio e Integración

Se **reutilizan íntegramente** los tipos existentes en `src/types/corruption.ts`:

- **Redes**: `CasoRed`, `ActorRed`, `ConexionRed` (sin cambios; ya modelan monto, moneda, monto_usd, estado procesal, tipo_actor, tipo de conexión y fuente_url).
- **Scraping**: `ScrapeResult`, `ScrapeSource` (ya definidos en `src/lib/scraper/types.ts`).
- **KPIs**: `KPIIndicator`, `KPIDataPoint` (ya definidos).

No se crean tipos nuevos. No se requieren dependencias npm nuevas (axios/cheerio ya están instalados; para el script se usa `tsx` o un compilador previo ya disponible).

## Pasos de Implementación

1. **Script de scraping estático:**
   - Crear `scripts/scrape-cna.ts` (o `src/lib/scraper/cli.ts`) que:
     - Ejecuta `scrapeInformesCna()`.
     - Normaliza los resultados a un objeto serializable limpio (`informes`, `generado_en`, `fuente`).
     - Escribe `src/data/scraped/informes-cna.json` (con marca de tiempo) y un índice `src/data/scraped/index.json` que lista las ejecuciones.
   - Añadir en `package.json`: `"scrape": "tsx scripts/scrape-cna.ts"` (o el runner que ya exista; si no, se usa `node --experimental-strip-types` del Node 20+).
   - Añadir un export barrel `src/data/scraped/index.ts` si el frontend va a consumir los JSON.
   - Asegurar `gitignore` no ignore `src/data/scraped/*.json` (deben versionarse).

2. **Caso PRAF** (`src/data/redes/praf.ts`):
   - `prafCaso`: id `praf`, título "Desfalco al PRAF", período 2010–2014, monto L.96,976,218 (US$3.9M), fuente MP + CNA, estado: requerimiento fiscal 2025 contra ~40 personas.
   - `prafActores`: exgerente admin. Ángel Paz Alvarenga, exjefe Bono Juvenil Raúl Salgado Zelaya, exjefa DiMujer Sandra Solano Aguirre, ONG/empresas de relleno (representadas como actores `empresa`), demás implicados.
   - `prafConexiones`: adjudicación de 596 contratos fraccionados, empresas de relleno, informes falsos de capacitación (tipos `financiero`, `empresarial`).

3. **Caso Rosa de Lobo** (`src/data/redes/rosa-de-lobo.ts`):
   - `rosaCaso`: id `rosa-de-lobo`, título "Caja Chica de la Dama", período 2011–2015, monto L.16M+ (US$680k; L.12,272,051 transferidos a cuenta personal), fuente MACCIH-OEA + MP + CNA.
   - `rosaActores`: Rosa Elena Bonilla de Lobo, Mauricio Mora Padilla (cuñado/director UDECO), las 9 personas colaboradoras (representadas como actor colectivo `testaferro`), funcionarios UFECIC/AT1C.
   - `rosaConexiones`: red de blanqueo (70+ cheques a 9 personas simulando relaciones contractuales), transferencia de L.12.27M del despacho a cuenta personal.

4. **Actualizar agregador** `src/data/redes/index.ts`:
   - Exportar y agregar `praf*` y `rosa*` a `allCasosRed`, `allActoresRed`, `allConexionesRed`.

5. **Indicadores institucionales CNA:**
   - `src/data/kpi/indicators.ts`: añadir indicadores de área `general` (perjuicio identificado, casos presentados, casos judicializados, casos en impunidad, instituciones acompañadas, recomendaciones presentadas) con `fuente_url` a `/opca` e `/indicadores`.
   - `src/data/kpi/corruption.ts` (o un nuevo `institucional.ts` exportado desde `src/data/kpi/index.ts`): añadir `KPIDataPoint[]` con las cifras publicadas por el CNA.

6. **Tests y Validación:**
   - Tests unitarios para los nuevos datasets (tipado y consistencia referencial de PRAF y Rosa de Lobo) y para el serializador del script de scraping si es separable.
   - Ejecutar `npm test`, `npm run lint` y `npm run build`.

## Decisiones Técnicas

- **Script CLI vs API route:** con `output: 'export'` las API routes no corren en producción. El script de CLI es la única vía coherente para regenerar datos. Se documenta la ejecución (manual / CI).
- **WordPress REST API en lugar de parseo HTML:** el sitio CNA renderiza su grid de investigaciones con JavaScript, por lo que el parseo estático es infructuoso (0 resultados). La WP REST API (`/wp-json/wp/v2/posts?categories=207`) expone los posts de forma fiable y directa, incluido el enlace al PDF del informe. `scrapeInformesCnaRest()` es la vía principal; `scrapeInformesCna()` (HTML) se conserva por compatibilidad.
- **Datos versionados en `src/data/scraped/`:** versionar los JSON garantiza que el sitio desplegado siempre tenga datos reproducibles, sin depender de la disponibilidad del sitio CNA en el momento del build.
- **Runner del script (`tsx`):** se añade `tsx` como devDependency para ejecutar TypeScript del script de CLI (`npm run scrape`). El import del script usa ruta relativa sin alias `@/` ni extensión para ser compilable por `tsc` y ejecutable por `tsx`.
- **Sin tipos nuevos:** se reutilizan `CasoRed`/`ActorRed`/`ConexionRed`/`ScrapeResult`/`KPIIndicator`/`KPIDataPoint` existentes.

## Riesgos y Mitigaciones

- **Bloqueo/rate limiting del sitio CNA:** el conector ya incluye `delay`/`rateLimitMs`; el script lo maneja con logs y reintentos suaves. Como los datos se versionan, un fallo de red no rompe el build desplegado.
- **Suma/Escritura de cifras erróneas:** solo se publican montos que aparecen en las fuentes (requerimiento MP, comunicado MACCIH, nota CNA); se replica el monto exacto documentado.
- **Cambio de estructura HTML del CNA:** los selectores de `cna.ts` se mantienen tolerantes; el script captura lo que se pueda y los datos curados (PRAF/Rosa) son independientes del scraping.
