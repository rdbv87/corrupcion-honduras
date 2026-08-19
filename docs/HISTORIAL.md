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
├── docs/                          # Documentación
│   └── HISTORIAL.md              # Este archivo
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── graph/                 # Componentes Cytoscape.js
│   │       ├── CytoscapeGraph.tsx
│   │       ├── graphUtils.ts
│   │       ├── graphStyles.ts
│   │       ├── graphLayouts.ts
│   │       └── index.ts
│   ├── data/
│   │   └── sample.ts             # Datos de ejemplo
│   ├── lib/
│   │   └── db/                    # Utilidades de BD
│   │       ├── index.ts
│   │       ├── migrate.ts
│   │       └── schema.sql
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

## Pendiente (Próximos Pasos)

### Paso 3: API Routes + Chatbot RAG
- [ ] API routes para CRUD de datos
- [ ] Servicio Python FastAPI para chatbot
- [ ] Integración con Ollama (Llama 3.1)
- [ ] ChromaDB para embeddings

### Paso 4: Scraping y Fuentes
- [ ] Scraper de noticias hondureñas
- [ ] Parser de documentos públicos
- [ ] Integración con APIs gubernamentales

### Paso 5: Búsqueda y Filtros
- [ ] Búsqueda full-text
- [ ] Filtros por fecha, tipo, monto
- [ ] Exportación de datos

### Paso 6: Línea Temporal
- [ ] Componente de timeline
- [ ] Visualización cronológica de eventos

### Paso 7: Responsividad y UX
- [ ] Diseño móvil
- [ ] Accesibilidad
- [ ] Modo oscuro

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
