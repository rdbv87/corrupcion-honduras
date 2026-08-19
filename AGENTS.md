# AGENTS.md — Corrupción Honduras

Portal open source para mapear, documentar y visibilizar el daño social de la corrupción en Honduras. Dirigido a ciudadanía, periodistas y activistas.

## Comandos

```bash
npm run dev        # Servidor local (Next.js)
npm run build      # Compilar para producción
npm run lint       # Verificar estilo (antes de cada PR)
npm run test       # Ejecutar tests (deben pasar antes de cada commit)
```

## Arquitectura

```
src/
├── components/    # UI y visualización de grafos con Cytoscape.js
├── server/        # Backend, BD, orquestación chatbot RAG con Ollama
└── data/          # Datasets por casos, áreas sociales, líneas temporales
tests/             # Tests al lado del archivo: foo.ts → foo.test.ts
```

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS
- **Backend:** Node.js o FastAPI Python
- **BD:** PostgreSQL + ChromaDB (vectorial local para chatbot)
- **Visualización:** Cytoscape.js para redes de corrupción
- **Chatbot:** RAG con Ollama (modelos open source)

## Convenciones

- **Variables/funciones:** `camelCase`
- **Componentes/clases:** `PascalCase`
- **Tests:** archivo `.test.ts` junto al archivo fuente
- **TypeScript:** `strict: true`, no usar `any` sin justificación
- **Entradas:** validar toda entrada del usuario
- **Chatbot:** aislar estrictamente al contexto de corrupción en Honduras

## No hagas

- No usar APIs comerciales; solo open source
- Chatbot no responde temas ajenos a corrupción en Honduras
- No subir `.env*` o credenciales al repo público
- No usar `any` sin justificar

## Flujo de trabajo

- Tareas no triviales: proponer plan → esperar OK del usuario
- Una tarea a la vez; reportar cambios al terminar
- Si no estás seguro al 80%, preguntar. No inventar.

## Configuración requerida

Copiar `.env.example` a `.env.local` y configurar:

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/corrupcion_hn
OLLAMA_BASE_URL=http://localhost:11434
CONTEXT7_API_KEY=
```

## Context7

Context7 proporciona documentación actualizada para librerías. Cuando necesites
consultar docs de alguna dependencia, menciona `context7` en tu instrucción, por
ejemplo:

```
¿Cómo se configura Tailwind CSS? use context7
```

La configuración del servidor MCP está en `opencode.json` (nivel proyecto).

## Dependencias clave

| Paquete | Uso |
|---------|-----|
| `next` | Framework frontend |
| `cytoscape` | Visualización de grafos |
| `chromadb` | BD vectorial (Python) |
| `ollama` | Modelos LLM locales |
