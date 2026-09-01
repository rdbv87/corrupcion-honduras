# Corrupción Honduras - Historial de Desarrollo

## Visión del Proyecto

Portal open source para mapear, documentar y visibilizar el daño social de la corrupción en Honduras. Dirigido a ciudadanía, periodistas y activistas.

### Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 14 + React 18 + TypeScript |
| Estilos | Tailwind CSS 3.4 |
| Visualización | Cytoscape.js 3.28 |
| Backend | Python FastAPI (chatbot RAG) |
| Base de datos | PostgreSQL |
| Vectorial | ChromaDB |
| LLM | Ollama + Llama 3.1 (8B) |

---

## Decisiones de Arquitectura

### Fuentes de Datos
- **Combinación**: Scraping de noticias + datos manuales + APIs gubernamentales

### Modelo de Grafo
- **Entidades**: Personas, Empresas, Instituciones
- **Relaciones**: Familiar, Financiero, Comercial, Político, Trabaja_con

### Alcance del Chatbot RAG
- Contexto general de corrupción en Honduras
- No limitado a casos específicos documentados

### Backend RAG
- **Híbrido**: Next.js (frontend) + Python FastAPI (servicio de chatbot)

---

## Pasos Completados

### Paso 0: Scaffolding Inicial ✅

**Archivos creados:**
- `next.config.js` - Configuración Next.js (output: standalone)
- `tailwind.config.ts` - Configuración Tailwind CSS
- `postcss.config.js` - PostCSS con Tailwind y Autoprefixer
- `.env.example` - Variables de entorno de ejemplo
- `src/app/globals.css` - Estilos globales Tailwind
- `src/app/layout.tsx` - Layout raíz con metadata en español
- `src/app/page.tsx` - Página principal

**Dependencias instaladas:**
- next 14.2.35, react 18, typescript 5.3
- tailwindcss 3.4, postcss, autoprefixer
- cytoscape 3.28

---

### Paso 1: Modelo de Datos ✅

**Tipos TypeScript** (`src/types/corruption.ts`):

| Tipo | Descripción |
|------|-------------|
| `Caso` | Caso de corrupción documentado |
| `Entidad` | Persona, empresa o institución |
| `Conexion` | Relación entre entidades |
| `CasoEntidad` | Relación caso-entidad con rol |
| `Fuente` | Evidencia o documento |
| `Impacto` | Daño social/económico |
| `EventoTemporal` | Evento en línea temporal |
| `GraphNode` | Nodo para Cytoscape.js |
| `GraphEdge` | Arista para Cytoscape.js |

**Esquema PostgreSQL** (`src/lib/db/schema.sql`):

7 tablas con índices y triggers:
- `casos` - Tabla principal de casos
- `entidades` - Personas, empresas, instituciones
- `conexiones` - Relaciones entre entidades
- `caso_entidad` - Relación caso-entidad (N:M)
- `fuentes` - Documentos y evidencias
- `impactos` - Métricas de daño social
- `eventos_temporales` - Línea temporal

**Utilidades DB** (`src/lib/db/`):
- `index.ts` - Pool de conexión PostgreSQL
- `migrate.ts` - Script de migración

**Datos de ejemplo** (`src/data/sample.ts`):
- 2 casos de corrupción
- 3 entidades (persona, empresa, institución)
- 2 conexiones
- 2 fuentes
- 2 impactos
- 2 eventos temporales

---

### Paso 2: Visualización con Cytoscape.js ✅

**Componentes** (`src/components/graph/`):

| Archivo | Función |
|---------|---------|
| `CytoscapeGraph.tsx` | Componente principal de renderizado |
| `graphUtils.ts` | Transformación de datos |
| `graphStyles.ts` | Estilos de nodos y aristas |
| `graphLayouts.ts` | 6 layouts disponibles |
| `index.ts` | Exportaciones |

**Funcionalidades implementadas:**

1. **Nodos coloreados por tipo:**
   - Persona: Azul (#3b82f6)
   - Empresa: Verde (#10b981)
   - Institución: Morado (#8b5cf6)
   - Caso: Rojo (#ef4444)

2. **Aristas con dirección:**
   - Grosor según fuerza de relación (0-1)
   - Colores por tipo de conexión
   - Flecha direccional

3. **Interactividad:**
   - Selección de nodos/aristas
   - Panel de detalles al seleccionar
   - Zoom y pan
   - Filtros por tipo de entidad

4. **Layouts disponibles:**
   - `cose` - Fuerza dirigida (recomendado)
   - `circle` - Circular
   - `concentric` - Concéntrico
   - `breadthfirst` - Jerárquico
   - `grid` - Cuadrícula
   - `random` - Aleatorio

5. **Panel de leyenda:**
   - Muestra colores por tipo de nodo

6. **Estadísticas:**
   - Conteo de casos, entidades y conexiones

---

## Estructura del Proyecto

```
corrupcion-hn/
├── backend/                       # Servicio Python FastAPI (chatbot RAG)
│   ├── app.py                     # Configuración
│   ├── main.py                    # Endpoints: /chat, /ingest, /health
│   ├── requirements.txt           # Dependencias Python
│   └── .env.example               # Variables de entorno
├── docs/                          # Documentación
│   └── HISTORIAL.md              # Este archivo
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API Routes CRUD
│   │   │   ├── casos/
│   │   │   ├── entidades/
│   │   │   ├── conexiones/
│   │   │   ├── fuentes/
│   │   │   ├── impactos/
│   │   │   ├── eventos/
│   │   │   ├── export/            # Exportación CSV/JSON
│   │   │   ├── graph/
│   │   │   ├── impactos/
│   │   │   ├── scrape/            # Scraping
│   │   │   └── search/            # Búsqueda global
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── chat/                  # Chat Widget
│   │   │   └── ChatWidget.tsx
│   │   ├── graph/                 # Componentes Cytoscape.js
│   │   │   ├── CytoscapeGraph.tsx
│   │   │   ├── graphUtils.ts
│   │   │   ├── graphStyles.ts
│   │   │   ├── graphLayouts.ts
│   │   │   └── index.ts
│   │   └── search/                # Búsqueda y Filtros
│   │       ├── SearchBar.tsx
│   │       ├── Filters.tsx
│   │       ├── DataTable.tsx
│   │       └── index.ts
│   │   └── timeline/              # Línea Temporal
│   │       ├── Timeline.tsx
│   │       └── index.ts
│   ├── data/
│   │   └── sample.ts             # Datos de ejemplo
│   ├── lib/
│   │   ├── db/                    # Utilidades de BD
│   │   │   ├── index.ts
│   │   │   ├── migrate.ts
│   │   │   ├── schema.sql
│   │   │   └── store.ts          # Store en memoria (CRUD)
│   │   └── scraper/              # Motor de scraping
│   │       ├── engine.ts         # Core: descarga + extracción
│   │       ├── sources.ts        # Fuentes configuradas
│   │       ├── types.ts          # Tipos de scraping
│   │       ├── utils.ts          # Utilidades
│   │       └── index.ts
│   └── types/
│       └── corruption.ts         # Tipos TypeScript
├── .env.example
├── .gitignore
├── AGENTS.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Comandos Disponibles

```bash
npm run dev        # Servidor local (http://localhost:3000)
npm run build      # Compilar para producción
npm run lint       # Verificar estilo
npm run test       # Ejecutar tests
```

---

### Paso 3: API Routes + Chatbot RAG ✅

**API Routes CRUD** (`src/app/api/`):

| Ruta | Métodos | Descripción |
|------|---------|-------------|
| `/api/casos` | GET, POST | Listar y crear casos |
| `/api/casos/[id]` | GET, PUT, DELETE | CRUD completo de caso |
| `/api/entidades` | GET, POST | Listar y crear entidades |
| `/api/entidades/[id]` | GET, PUT, DELETE | CRUD completo de entidad |
| `/api/conexiones` | GET, POST | Listar y crear conexiones |
| `/api/conexiones/[id]` | GET, PUT, DELETE | CRUD completo de conexión |
| `/api/fuentes` | GET, POST | Listar y crear fuentes |
| `/api/impactos` | GET, POST | Listar y crear impactos |
| `/api/eventos` | GET, POST | Listar y crear eventos temporales |
| `/api/graph` | GET | Datos completos del grafo (Cytoscape) |

**Capa de acceso a datos** (`src/lib/db/store.ts`):
- Store en memoria con datos de ejemplo
- Interfaz lista para migrar a PostgreSQL
- CRUD completo para todas las entidades

**Servicio Python FastAPI** (`backend/`):
- `main.py` - Endpoints: `/chat`, `/ingest`, `/health`, `/collections`
- `config.py` - Variables de entorno centralizadas
- `requirements.txt` - Dependencias Python
- Integración con Ollama (Llama 3.1) para generación
- ChromaDB para embeddings y búsqueda semántica (RAG)
- System prompt estricto: solo corrupción en Honduras
- Endpoint `/ingest` para indexar documentos en la colección vectorial

**Chat Widget** (`src/components/chat/ChatWidget.tsx`):
- Componente flotante con botón toggle
- UI con Tailwind CSS
- Historial de conversación en sesión
- Estados de carga y error
- Conectado al servicio Python FastAPI
- Integrado en la página principal

---

### Paso 4: Scraping y Fuentes ✅

**Motor de Scraping** (`src/lib/scraper/`):

| Archivo | Función |
|---------|---------|
| `types.ts` | Tipos: `ScrapeSource`, `ScrapeResult`, `ScrapeSelector`, `ScrapeJob` |
| `sources.ts` | 4 fuentes configuradas con selectores CSS |
| `engine.ts` | Core: descarga HTML con axios + extracción con Cheerio |
| `utils.ts` | Limpieza de texto, parsing de fechas, normalización de URLs |
| `index.ts` | Exportaciones del módulo |

**Fuentes configuradas:**
- La Prensa (noticias)
- El Heraldo (noticias)
- Contra Corriente (investigación)
- Gaceta Oficial (documentos gubernamentales)

**API Routes de Scraping** (`src/app/api/scrape/`):

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/scrape/sources` | GET | Listar fuentes configuradas |
| `/api/scrape/run` | POST | Ejecutar scraping (fuente específica o todas) |
| `/api/scrape/preview` | POST | Previsualizar contenido scrapeado |

**Funcionalidades:**
- Rate limiting configurable por fuente (1-3s entre requests)
- User-Agent realista para evitar bloqueos
- Deduplicación por URL antes de almacenar
- Parsing de fechas en español (dd/mm/yyyy, "12 de marzo de 2024")
- Normalización de URLs relativas a absolutas
- Integración con store de Fuentes (createFuente)
- Store actualizado con `updateFuente` y `getFuenteByUrl`

**Dependencias nuevas:**
- `cheerio` — parsing de HTML
- `axios` — requests HTTP

---

### Paso 5: Búsqueda y Filtros ✅

**Store Layer** (`src/lib/db/store.ts`):

Funciones de búsqueda y filtro agregadas:

| Función | Descripción |
|---------|-------------|
| `searchCasos(filters)` | Búsqueda full-text + filtros (status, monto, fecha) |
| `searchEntidades(filters)` | Búsqueda + filtros (tipo, ciudad, país) |
| `searchConexiones(tipo)` | Filtro por tipo de conexión |
| `searchAll(filters)` | Búsqueda cruzada global con scoring de relevancia |

**API Routes de Búsqueda** (`src/app/api/search/`):

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/search` | GET | Búsqueda global (`?q=&tipo=&status=`) |
| `/api/casos` | GET | Con query params: `?q=&status=&monto_min=&monto_max=&fecha_desde=&fecha_hasta=` |
| `/api/entidades` | GET | Con query params: `?q=&tipo=&ciudad=&pais=` |
| `/api/export` | GET | Exportar datos: `?format=csv\|json&tipo=casos\|entidades\|all` |

**Funcionalidades de Exportación:**
- CSV por tipo (casos, entidades, etc.)
- JSON completo de todas las colecciones
- Descarga automática del archivo

**Componentes Frontend** (`src/components/search/`):

| Componente | Función |
|------------|---------|
| `SearchBar.tsx` | Input de búsqueda con debounce (300ms) y botón limpiar |
| `Filters.tsx` | Dropdowns de filtros: status, tipo, monto min/max, fecha desde/hasta |
| `DataTable.tsx` | Tabla genérica con columnas configurables y render custom |

**Integración en `page.tsx`:**
- Panel de búsqueda y filtros en la parte superior
- Tabs: Búsqueda General / Casos / Entidades
- Tabla de resultados con columnas configurables
- Botones de exportación (CSV Casos, CSV Entidades, JSON Completo)
- Grafo se actualiza con datos filtrados
- Estadísticas reflejan resultados filtrados

---

### Paso 6: Línea Temporal ✅

**Tipos** (`src/types/corruption.ts`):
- Nuevo tipo `EventoTemporalType`: investigacion, sentencia, denuncia, resolucion, comparecencia, medida cautelar, otro
- `EventoTemporal.tipo` ahora usa el tipo union en vez de `string`

**Sample Data** (`src/data/sample.ts`):
- 10 eventos distribuidos entre ambos casos
- Cubre los 7 tipos de eventos

**Store** (`src/lib/db/store.ts`):

| Función | Descripción |
|---------|-------------|
| `getEventosByCasoId(casoId)` | Eventos de un caso, ordenados cronológicamente |
| `searchEventos(filters)` | Filtro por caso, tipo, rango de fechas |
| `updateEvento(id, data)` | Actualizar un evento |

**API** (`src/app/api/eventos/`):
- `GET /api/eventos` — con query params: `?caso_id=&tipo=&fecha_desde=&fecha_hasta=`

**Componente Timeline** (`src/components/timeline/`):

| Archivo | Función |
|---------|---------|
| `Timeline.tsx` | Línea vertical cronológica con eventos |
| `index.ts` | Exportaciones |

**Funcionalidades del Timeline:**
- Línea vertical con puntos de color por tipo de evento
- Colores: azul (investigación), rojo (sentencia), amarillo (denuncia), verde (resolución), púrpura (comparecencia), naranja (medida cautelar)
- Filtro por caso con botones
- Fecha formateada en español
- Muestra caso asociado a cada evento
- Estados vacíos con icono ilustrativo

**Integración en `page.tsx`:**
- Nuevo tab "Línea Temporal" con conteo de eventos
- Timeline se actualiza al filtrar por caso
- `fetchEventos()` se ejecuta al cambiar el filtro

---

### Paso 7: Responsividad y UX ✅

**Modo Oscuro** (`tailwind.config.ts`):
- `darkMode: "class"` habilitado
- ThemeProvider con localStorage persistence
- ThemeToggle (botón sol/luna)

**Estilos** (`src/app/globals.css`):
- Dark mode base styles: `html.dark` con colores de fondo/texto
- Utility classes reutilizables: `.card`, `.btn-primary`, `.input-base`, `.select-base`
- Focus-visible ring para navegación por teclado
- Estilos base para `body`, inputs, selects en dark mode

**Responsividad** (todos los componentes):
- `page.tsx`: Responsive breakpoints (sm/md/xl) para el layout principal
- ChatWidget: `max-w-[calc(100vw-2rem)]` en móvil, full-width bottom sheet
- Filtros y búsqueda: flex-wrap para pantallas pequeñas
- Sidebar: se oculta en móvil con toggle

**Accesibilidad** (todos los componentes):
- `skip-to-content` link en `layout.tsx`
- Labels en SearchBar y Filters (visually hidden + `htmlFor`)
- `role="group"` en botones de filtro de caso
- `<ol>` semántico en Timeline con `aria-label`
- `<time>` con `dateTime` ISO en eventos
- `<article>` semántico para cada evento
- `scope="col"` en DataTable headers
- `aria-hidden="true"` en elementos decorativos
- Focus-visible rings en todos los botones interactivos

**Dark mode en todos los componentes:**
- ChatWidget, Timeline, SearchBar, Filters, DataTable, CytoscapeGraph
- Todos los componentes usan `dark:` variants de Tailwind

---

### Paso 8: KPIs de Impacto Social + Redes de Corrupción ✅

**Eje 1: KPIs de Impacto Social**

Nuevos tipos (`src/types/corruption.ts`):
- `AreaImpacto`: salud, educación, empleo, infraestructura, tecnología, general
- `KPIIndicator`: indicador con área, nombre, unidad, fuente, color
- `KPIDataPoint`: punto de datos (indicator_id, year, value)
- `KPISummary`: resumen por área con tendencia

Datos estáticos (`src/data/kpi/`):
- `indicators.ts` — 18 indicadores definidos en 6 áreas
- `health.ts` — Gasto salud %PIB, mortalidad infantil, esperanza de vida, cobertura IHSS
- `education.ts` — Gasto educación %PIB, años escolaridad, cobertura secundaria, abandono
- `employment.ts` — Desempleo, informalidad, pobreza $5.50/día
- `infrastructure.ts` — Inversión pública, acceso agua, electrificación
- `technology.ts` — Internet users, telefonía móvil
- `corruption.ts` — CPI Transparency International (2001–2025), IDH (2000–2022)

Fuentes de datos abiertos utilizadas:
- Transparency International (CPI)
- World Bank Open Data
- PAHO/OPS (salud Honduras)
- INE Honduras (indicadores sociales)
- OECD Public Governance Reviews
- SEFIN / countryeconomy.com (gasto público)
- UNDP (IDH)
- ITU / DIGER (tecnología)

API Routes KPI (`src/app/api/kpi/`):
| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/kpi/indicators` | GET | Listar indicadores (filtro por área) |
| `/api/kpi/data` | GET | Datos por indicador (filtro year_from/year_to) |
| `/api/kpi/summary` | GET | Resumen de todas las áreas |

Componentes KPI (`src/components/kpi/`):
| Componente | Función |
|------------|---------|
| `KPIDashboard.tsx` | Grid de cards por área con filtro y sparklines |
| `KPIAreaCard.tsx` | Card individual con mini-gráfico SVG y cambio % |
| `KPITimeline.tsx` | Gráfica SVG de línea temporal de un indicador |

**Eje 2: Redes de Corrupción**

Nuevos tipos (`src/types/corruption.ts`):
- `StatusLegal`: condenado, procesado, prófugo, investigado, absuelto
- `TipoActor`: funcionario, empresario, empresa, testaferro, político, proveedor
- `TipoConexionRed`: financiero, familiar, político, empresarial, testaferro
- `CasoRed`: metadata de caso emblemático
- `ActorRed`: actor involucrado con status legal y monto
- `ConexionRed`: conexión entre actores
- `RedGraphData`: datos formateados para Cytoscape

Datos de casos (`src/data/redes/`):

| Archivo | Caso | Monto | Período |
|---------|------|-------|---------|
| `ihss.ts` | Desfalco IHSS | L.6,399M (US$266M) | 2010–2014 |
| `hospitales-moviles.ts` | Hospitales Móviles ASJ | US$47.5M | 2020 |
| `pandora.ts` | Caso Pandora | L.282M (US$12M) | 2013–2018 |

Actores documentados:
- **IHSS**: 12 actores (Mario Zelaya, Bertetty, 5 empresas fantasma, testaferros)
- **Hospitales Móviles**: 8 actores (Bográn, Moraes, López Guzmán, ex-Secretarias)
- **Pandora**: 8 actores (Regalado, 3 fundaciones/partidos, diputados)

API Routes Redes (`src/app/api/redes/`):
| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/redes/casos` | GET | Listar casos emblemáticos |
| `/api/redes/casos/[id]` | GET | Metadata de un caso |
| `/api/redes/casos/[id]/actores` | GET | Actores de un caso |
| `/api/redes/casos/[id]/conexiones` | GET | Conexiones entre actores |
| `/api/redes/casos/[id]/graph` | GET | Grafo para Cytoscape.js |

Componentes Redes (`src/components/redes/`):
| Componente | Función |
|------------|---------|
| `CasoSelector.tsx` | Selector de caso con metadata y monto |
| `RedCorrupcion.tsx` | Grafo Cytoscape de red con leyenda de actores |
| `ActorDetail.tsx` | Panel de detalle de actor con conexiones |

**Navegación y páginas:**
- `/`: Búsqueda, casos, entidades, línea temporal y grafo general
- `/kpis`: Dashboard por áreas y línea temporal de cada indicador
- `/redes`: Casos emblemáticos con `CasoSelector`, `RedCorrupcion` y `ActorDetail` en layout de 12 columnas
- Cabecera global con enlaces a las tres secciones y selector de tema

### Paso 8: Adopción de Estilo Visual Retro y Minimalista ✅

- **Concepto rector**: Estética de *expediente / dossier judicial desclasificado* y prensa cívica de datos abiertos.
- **Paleta cromática**:
  - Claro: Fondo pergamino/papel técnico (`#f5f3ec`), superficies blancas/crema, bordes sólidos `#1c1917` (2px), texto tinta negra.
  - Oscuro: Fondo carbón mate (`#121316`), superficies `#1a1c22`/`#1f2026`, bordes `#3f3f46`, texto marfil claro.
- **Componentes**:
  - Sombras duras estilo brutalista/offset (`shadow-retro: 3px 3px 0px #1c1917`).
  - Tarjetas y paneles con esquinas nítidas sin redondeos excesivos (`rounded-none`/`rounded-sm`).
  - Botones mecánicos interactivos (`active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`).
  - Badges y etiquetas en formato de sello oficial `[ ESTADO ]` con tipografía monoespaciada.
  - Grafos Cytoscape con trazo técnico y paleta retro para actores (`#1d4ed8` azul tinta, `#d97706` ámbar, `#b91c1c` rojo sello, `#6d28d9` púrpura archivo, `#15803d` verde contable).
  - Terminal interactiva para el asistente RAG en [src/components/chat/ChatWidget.tsx](src/components/chat/ChatWidget.tsx).

---

### Feature 006: Conector Especializado de Informes CNA ✅

**SDD:** [`features/006-conector-cna/`](features/006-conector-cna/) (`spec.md`, `plan.md`, `tasks.md`)

**Objetivo:** Extender el motor de scraping con un conector dedicado al [Consejo Nacional Anticorrupción](https://www.cna.hn/), la fuente primaria del proyecto, para ingestar y indexar sus informes de investigación.

**Cambios:**
- `src/types/corruption.ts` — Nuevo valor `'informe'` en el tipo `SourceType`.
- `src/lib/scraper/sources.ts` — Nueva fuente `cna` (listado de investigaciones, `rateLimitMs: 4000`).
- `src/lib/scraper/cna.ts` — (nuevo) `scrapeInformesCna()`, `detectMontos()`, extracción de enlace PDF; selectores adaptados a la estructura WordPress/Elementor del portal.
- `src/lib/scraper/types.ts` — `ScrapeResult` ampliado con `pdfUrl?` y `montosDetectados?`.
- `src/lib/scraper/index.ts` — Exporta el conector CNA.
- `src/app/api/scrape/run/route.ts` — Consolida las entradas CNA como `Fuente` con `tipo: 'informe'` y `confiabilidad: 0.95`; reporta montos detectados.
- `jest.config.js` + `src/lib/scraper/__tests__/cna.test.ts` — (nuevos) base de test configurada con `next/jest` y tests de `detectMontos`.
- Dependencia dev: `@types/jest` (tipos para el runner de tests).

**Validación:** `npm test` (5 tests), `npm run lint`, `npm run build` y `tsc --noEmit` aprobados.

---

## Pendiente (Próximos Pasos)

### Paso 9: PostgreSQL + Autenticación
- [ ] Migrar store en memoria a PostgreSQL
- [ ] Sistema de roles (admin, editor, viewer)
- [ ] Login con credenciales
- [ ] CRUD protegido por autenticación

### Paso 10: Despliegue
- [ ] Docker Compose (Next.js + FastAPI + PostgreSQL)
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en Vercel + Railway/DigitalOcean

---

## Notas Técnicas

### TypeScript
- `strict: true` en tsconfig.json
- Sin uso de `any` sin justificación
- Tipado estricto en componentes Cytoscape

### Cytoscape.js
- Se eliminaron tipos `cytoscape.Stylesheet` por incompatibilidad con @types/cytoscape
- Se uso tipado inline para funciones de estilo

### Build
- Next.js 14 con App Router
- Output standalone para producción
- Static generation para páginas públicas

---

*Última actualización: 2026-08-18*
