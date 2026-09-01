# Tech Stack y Convenciones

_Cómo está construida la plataforma Corrupción Honduras y las reglas de arquitectura y desarrollo que todo el código debe respetar._

## Tecnologías

- **Lenguaje:** TypeScript 5.3+ en modo estricto (`strict: true`) en frontend/APIs, Python 3.10+ en microservicio backend RAG.
- **Framework frontend / API:** Next.js 14 (App Router) + React 18 + Node.js 20+.
- **Visualización de grafos de red:** Cytoscape.js 3.28+ con layouts `cose`, `concentric`, `breadthfirst` y estilos visuales personalizados.
- **Estilos e interfaz:** Tailwind CSS 3.4 + PostCSS + Iconografía SVG accesible.
- **Persistencia y Base de Datos:** PostgreSQL con pool `pg` y soporte para SQLite / Store en memoria (`src/lib/db/store.ts`) para entorno de desarrollo ágil y tests.
- **Microservicio RAG / Procesamiento:** Python FastAPI con soporte para vectorización y búsqueda contextual de expedientes del CNA.
- **Ingesta y Web Scraping:** Axios + Cheerio con conectores adaptados a portales públicos y al repositorio del CNA (https://www.cna.hn/).
- **Tests y Validación:** Jest 29 + React Testing Library + ESLint (`eslint-config-next`).

## Archivos y Módulos Clave

- `src/app/` — Rutas principales (`/`, `/redes`, `/kpis`), layouts y endpoints REST (`/api/casos`, `/api/redes`, `/api/kpi`, `/api/scrape`, etc.).
- `src/components/redes/` — Componentes del explorador de redes (`RedCorrupcion.tsx`, `CasoSelector.tsx`, `ActorDetail.tsx`).
- `src/components/kpi/` — Tableros y tarjetas de perjuicio social y económico (`KPIDashboard.tsx`, `KPIAreaCard.tsx`, `KPITimeline.tsx`).
- `src/components/graph/` — Wrapper de Cytoscape (`CytoscapeGraph.tsx`), hojas de estilos (`graphStyles.ts`), algoritmos de layout (`graphLayouts.ts`) y utilidades.
- `src/components/timeline/` — Visualizador cronológico de eventos judiciales y denuncias.
- `src/data/` — Datasets estructurados de casos emblemáticos (`redes/ihss.ts`, `redes/hospitales-moviles.ts`, `redes/pandora.ts`, etc.) y catálogo de indicadores.
- `src/lib/db/` — Esquema relacional (`schema.sql`), scripts de migración y capa de acceso a datos.
- `src/lib/scraper/` — Motor de scraping (`engine.ts`), catálogo de fuentes públicas (`sources.ts`) y parsers de contenido del CNA.
- `src/types/corruption.ts` — Definiciones de tipos TypeScript para todo el dominio.
- `backend/` — Servicio FastAPI para búsqueda semántica e indexación RAG.

## Comandos

- `npm run dev` — Inicia el servidor de desarrollo en `http://localhost:3000`.
- `npm test` — Ejecuta la suite de pruebas unitarias y de componentes con Jest.
- `npm run lint` — Ejecuta ESLint y comprobaciones de consistencia de tipos.
- `npm run build` — Compila la aplicación Next.js para producción.

## Modelo de Datos / Dominio

- **`Caso`**: Caso emblemático de corrupción (identificador, título, descripción, fechas, estado procesal, monto económico estimado en Lempiras/USD, resumen de impacto social).
- **`Entidad`**: Actor dentro de la red. Tipos permitidos: `persona`, `empresa`, `institucion`, `organismo`, `otro`.
- **`Conexion`**: Arista o vínculo relacional entre dos entidades. Tipos permitidos: `financiero`, `politico`, `familiar`, `comercial`, `trabaja_con`, `otro`. Incluye nivel de fuerza/evidencia (1-5) y fechas.
- **`CasoEntidad`**: Relación N:M que asocia un actor a un caso específico definiendo su rol (ej. "Autor intelectual", "Testaferro", "Beneficiario", "Empresa de fachada").
- **`Fuente`**: Evidencia documental verificable. Debe incluir `url` (con prioridad a informes de investigación del CNA https://www.cna.hn/, requerimientos fiscales o sentencias), `tipo` (`documento`, `noticia`, `oficial`, `sentencia`), y nivel de confiabilidad (1-5).
- **`Impacto`**: Cuantificación del perjuicio ocasionado. Tipos: `economico`, `salud`, `educacion`, `social`, `infraestructura`, `otro`. Incluye montos, personas afectadas y descripción del daño tangible a la población.
- **`EventoTemporal`**: Hito dentro de la cronología del caso (`denuncia`, `investigacion`, `requerimiento`, `captura`, `sentencia`, `aseguramiento`).
- **`GraphNode` & `GraphEdge`**: Estructuras adaptadas para renderizado fluido en Cytoscape.js con metadatos visuales (colores, tamaños, clases semánticas).

## Convenciones

- **Tipado estricto**: No usar `any`. Toda función, componente o API route debe contar con interfaces explícitas.
- **Trazabilidad obligatoria**: No se puede registrar un actor, vínculo o cifra de impacto sin enlazarlo a al menos una `Fuente` verificable.
- **Cálculo de equivalencia social**: Toda cifra económica desviada debe contar con su cálculo de equivalencia en daño social según los indicadores del CNA/INE (ej. L. X millones = N tratamientos de hemodiálisis / N escuelas no reparadas).
- **Manejo de errores y resiliencia**: Las rutas de API deben validar payloads con códigos HTTP adecuados (400, 404, 500) y respuestas JSON estructuradas (`{ success, data, error }`). Los scrapers deben implementar control de tasa (rate limiting) y timeouts para evitar bloqueos.
- **Idioma del contenido**: Español estándar/hondureño formal para toda la interfaz, mensajes y descripciones de casos.

## Estilo Visual y UI (Retro & Minimalista)

- **Concepto rector**: Estética de **archivo de investigación / dossier judicial desclasificado** y prensa de datos cívicos.
- **Paleta cromática**:
  - **Modo claro**: Fondo papel/pergamino técnico claro (`#f5f3ec`), superficies `#ffffff`/`#faf8f2`, bordes negros sólidos (`#1c1917`), texto tinta negra (`#1c1917`).
  - **Modo oscuro**: Fondo carbón/pizarra vintage (`#121316`), superficies `#1a1c22`/`#1f2026`, bordes `#3f3f46`, texto marfil (`#f4f4f5`).
  - **Acentos de sello**: Rojo lacre/sello (`#b91c1c`), azul tinta clásica (`#1d4ed8`), ámbar archivador (`#d97706`), verde contable (`#15803d`).
- **Componentes y Geometría**:
  - Bordes sólidos de 2px con esquinas nítidas (`rounded-none` o `rounded-sm`).
  - Sombras duras estilo "hard shadow / offset" (`shadow-retro`: `3px 3px 0px 0px rgba(28,25,23,1)`).
  - Botones mecánicos con feedback táctil (`active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`).
  - Etiquetas y sellos de estado en tipografía monoespaciada con formato `[ ESTADO ]`.
- **Semántica visual de redes en Cytoscape**:
  - Personas: Azul tinta (`#1d4ed8`)
  - Empresas / Contratistas: Ámbar vintage (`#d97706`)
  - Instituciones públicas: Púrpura archivo (`#6d28d9`)
  - Organismos / Otros: Verde contable (`#15803d`) / Grafito (`#4b5563`)
  - Casos: Rojo sello oficial (`#b91c1c`)
- **Semántica de aristas**: Trazo técnico nítido con flechas triangulares, grosor proporcional a la fuerza probatoria y etiquetas angulares autorotadas.

## Límites Duros

- **Prohibido inventar datos**: Ningún caso, nombre, empresa, vínculo o cifra puede ser agregado sin respaldo en fuentes públicas verificables (CNA, MP, TSC, sentencias).
- **Cero secretos en el repositorio**: No subir credenciales, claves de APIs o variables de base de datos a Git; utilizar siempre `.env.local`.
- **Integridad del esquema**: No alterar `schema.sql` sin crear la correspondiente migración y documentar el cambio en el SDD.
