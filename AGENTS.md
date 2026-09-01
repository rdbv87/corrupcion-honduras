# Corrupción Honduras (corrupcion-hn)

Plataforma cívica y de datos abiertos para mapear, administrar y visualizar redes de corrupción por casos emblemáticos en Honduras, cuantificando el perjuicio económico, social e institucional ocasionado a la sociedad hondureña, con base en fuentes públicas confiables y verificables, primordialmente los informes de investigación del Consejo Nacional Anticorrupción (CNA: https://www.cna.hn/).

## Stack
- Lenguaje: TypeScript estricto (strict mode) en frontend/API y Python 3.10+ en backend RAG
- Framework / runtime: Next.js 14 (App Router) + React 18 + Node.js 20+
- Visualización de grafos: Cytoscape.js 3.28 + layouts personalizados
- Estilos y UI: Tailwind CSS 3.4 + PostCSS
- Base de datos: PostgreSQL (`pg`) con esquema relacional / Store modular para desarrollo local
- Backend complementario: Python FastAPI (servicios RAG, embeddings y vectorización)
- Ingesta y Web Scraping: Axios + Cheerio con conectores adaptados a portales públicos (CNA, fuentes oficiales, medios de investigación)
- Tests: Jest + React Testing Library

## Comandos
- `npm run dev` — arranca el servidor Next.js en entorno local (`http://localhost:3000`)
- `npm test` — ejecuta la suite de tests unitarios y de componentes
- `npm run lint` — revisa el estilo y consistencia de tipos TypeScript / ESLint
- `npm run build` — compila la aplicación para producción

## Estructura del proyecto
- `src/app/` — Rutas y vistas de Next.js App Router (`/`, `/redes`, `/kpis`) y endpoints API (`/api/casos`, `/api/redes`, `/api/scrape`, `/api/kpi`, etc.)
- `src/components/` — Componentes modulares UI organizados por dominio:
  - `redes/` — Visualizadores de red Cytoscape, selector de casos emblemáticos y fichas de actores
  - `kpi/` — Dashboards y tarjetas de perjuicio social y económico
  - `graph/` — Configuraciones de estilos, layouts y utilidades de grafos
  - `timeline/` — Línea temporal de eventos judiciales y denuncias
  - `chat/` — Interfaz de consulta y asistente
- `src/data/` — Datasets estructurados de casos emblemáticos (`ihss.ts`, `hospitales-moviles.ts`, `pandora.ts`), catálogo de indicadores de impacto y datos base
- `src/lib/` — Lógica central:
  - `db/` — Esquema SQL (`schema.sql`), migraciones y capa de persistencia
  - `scraper/` — Motor de scraping, definición de fuentes (`sources.ts`) y utilidades de parsing de portales (CNA, etc.)
- `src/types/` — Definiciones de tipos TypeScript para casos, actores, conexiones, impactos, fuentes y nodos/aristas
- `backend/` — Microservicio FastAPI para búsqueda vectorial RAG y procesamiento de lenguaje natural
- `spec_template/` — Plantilla del marco SDD (Spec-Driven Development) del proyecto
- `docs/` — Registro histórico de decisiones de diseño y bitácora de desarrollo

## Convenciones
- **Estilo visual (Retro & Minimalista)**: Estética editorial de expediente/dossier desclasificado. Bordes nítidos de 2px, sombras duras (`shadow-retro`), tipografía monoespaciada para códigos/sellos `[ ESTADO ]`, cifras y metadatos, y fondos cálidos papel/carbón mate.
- **Tipado estricto**: Tipos explícitos para entidades de dominio (`Caso`, `Entidad`, `Conexion`, `Fuente`, `Impacto`, `GraphNode`, `GraphEdge`). Prohibido el uso de `any` sin justificación explícita.
- **Rigor documental y trazabilidad**: Toda entidad, relación o cifra de perjuicio debe vincularse a una `Fuente` verificable (con URL a investigaciones del CNA https://www.cna.hn/, requerimientos fiscales o sentencias judiciales).
- **Tipología de redes**: Clasificación consistente de nodos (`persona`, `empresa`, `institucion`, `organismo`) y aristas (`financiero`, `politico`, `familiar`, `comercial`, `trabaja_con`).
- **Cuantificación del perjuicio social**: Desglosar no solo el monto económico desviado (Lempiras/USD), sino su equivalencia en daño social tangible (pérdida de atenciones médicas, vacunas/medicamentos no comprados, pupitres o escuelas deterioradas, sobrecostos de infraestructura).
- **Manejo de errores y resiliencia**: Validar entradas en API routes, manejar errores en scrapers mediante límites de tasa (rate limiting) y respuestas estructuradas.
- **Idioma**: Español formal para todo el contenido público, visualizaciones, variables de dominio y mensajes de cara al usuario.

## No hagas
- **Sin datos no verificados**: No inventar ni alucinar casos, actores, relaciones o cifras de impacto sin respaldo documental público (CNA, MP, TSC, etc.).
- **Neutralidad y rigor**: No publicar acusaciones ni adjetivos difamatorios no sustentados en expedientes o investigaciones documentadas.
- **Límites de infraestructura**: No incluir claves de API, contraseñas o secretos en el repositorio; usar siempre `.env.local` respetando `.gitignore`.
- **Modificaciones desordenadas**: No tocar esquemas de base de datos ni agregar dependencias npm/pip sin justificación técnica y registro en el SDD.

## Flujo de trabajo (SDD)
- Todo desarrollo sigue el ciclo SDD: `spec.md` (requisitos y criterios de aceptación) → `plan.md` (diseño técnico) → `tasks.md` (checklist de tareas) → implementación de código y validación.
- Antes de una tarea no trivial, propón un plan y espera confirmación.
- Una tarea a la vez; al terminar, reporta los cambios realizados y valida con pruebas/lint.
- Si hay dudas o falta de información en las fuentes públicas, pregunta y valida antes de asumir.

## Documentación
- Constitución y especificaciones: [spec_template/README.md](spec_template/README.md)
- Misión del proyecto: [spec_template/constitution/mission.md](spec_template/constitution/mission.md)
- Tech Stack y estándares: [spec_template/constitution/tech-stack.md](spec_template/constitution/tech-stack.md)
- Roadmap de casos y features: [spec_template/constitution/roadmap.md](spec_template/constitution/roadmap.md)
- Bitácora de desarrollo: [docs/HISTORIAL.md](docs/HISTORIAL.md)