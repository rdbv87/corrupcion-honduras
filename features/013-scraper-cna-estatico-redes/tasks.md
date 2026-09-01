# 013 · Scraper CNA Estático + 5 Redes — Tareas

_Checklist de tareas de implementación derivado de `plan.md`. Tareas atómicas y verificables; marcar `[x]` al completarlas._

## 1. Script de Scraping Estático
- [x] Crear `scripts/scrape-cna.ts` que invoque el conector CNA y serialice resultados.
- [x] Escribir marcado de tiempo y versión en los JSON de salida (`src/data/scraped/informes-cna.json` + `index.json`).
- [x] Añadir comando `npm run scrape` en `package.json`.
- [x] Añadir barrel `src/data/scraped/index.ts` y permitir que los JSON queden versionados en git.
- [x] **Resolver scraping del sitio actual**: se descubrió que `/investigaciones/` renderiza su grid con JavaScript (Elementor/ANWP), por lo que el parseo HTML devuelve 0. Se añadió `scrapeInformesCnaRest()` basado en la **WordPress REST API** (`/wp-json/wp/v2/posts`, categoría raíz 207 "Investigación"), que extrae 47 informes de forma fiable.

## 2. Caso PRAF
- [x] Crear `src/data/redes/praf.ts` con `prafCaso`, `prafActores`, `prafConexiones` (datos MP/CNA verificados: L.96,976,218; 596 contratos; Bono Juvenil + DiMujer).
- [x] Incluir actores: Ángel Paz Alvarenga, Raúl Salgado Zelaya, Sandra Solano Aguirre y las ONG/empresas de relleno implicadas.

## 3. Caso Rosa de Lobo
- [x] Crear `src/data/redes/rosa-de-lobo.ts` con `rosaCaso`, `rosaActores`, `rosaConexiones` (datos MACCIH/MP verificados: L.16M+, L.12,272,051 a cuenta personal, 70+ cheques a 9 personas).
- [x] Incluir actores: Rosa Elena Bonilla de Lobo, Mauricio Mora Padilla y los colaboradores/testaferros.

## 4. Agregador de Redes
- [x] Actualizar `src/data/redes/index.ts` para exportar y agregar los casos PRAF y Rosa de Lobo a `allCasosRed`/`allActoresRed`/`allConexionesRed`.

## 5. KPIs Institucionales del CNA
- [x] Añadir indicadores de área `general` en `src/data/kpi/indicators.ts` (perjuicio, casos presentados, judicializados, en impunidad).
- [x] Añadir series de datos institucionales (`src/data/kpi/institucional.ts`) con fuente a `/opca` e `/indicadores` del CNA, usando solo cifras publicadas.

## 6. Pruebas y Control de Calidad
- [x] Escribir tests de consistencia referencial y tipado para PRAF y Rosa de Lobo (`src/data/redes/__tests__/redes-data.test.ts`).
- [x] Testear el barrel de datos scrapeados (`src/data/scraped/__tests__/scraped-data.test.ts`).
- [x] Ejecutar `npm test` (22 tests en 4 suites) — todos pasan.
- [x] Ejecutar `npm run lint` — sin errores.
- [x] Ejecutar `npm run build` (export estático) — 7 páginas generadas sin errores.

## 7. Cierre y Documentación
- [x] Actualizar `docs/HISTORIAL.md` con la feature 013.
- [x] Añadir la feature 013 y la finalización de 5 casos al roadmap (`spec_template/constitution/roadmap.md`).
