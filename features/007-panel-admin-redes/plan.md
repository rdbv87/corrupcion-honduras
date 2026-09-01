# 007 · Panel de Administración y Edición de Redes — Plan Técnico

_Cómo se implementa técnicamente lo especificado en `spec.md`, respetando `constitution/tech-stack.md` y `constitution/mission.md`._

## Enfoque Arquitectural

Se **extrae la persistencia de las redes de casos emblemáticos** de los archivos estáticos de solo lectura a un **store mutable** (`src/lib/db/redesStore.ts`), siguiendo el mismo patrón del `store.ts` ya existente (arrays en memoria + CRUD + generador de IDs). Los archivos de `src/data/redes/` pasan a ser la fuente de **siembra (seed)** inicial del store.

Este store se convierte en la **única fuente de verdad** tanto de la vista pública (`/redes`) como del nuevo panel de administración (`/admin`). Ambas consumen las mismas APIs, garantizando que una edición desde el panel se refleje al instante en el grafo público.

Se añade un **conjunto de endpoints CRUD** bajo `/api/redes/admin/*` (create/update/delete) y se **redirigen los endpoints de lectura existentes** (`/api/redes/casos`, `[id]/graph`, `[id]/actores`, `[id]/conexiones`) para consultar el store en lugar de los datos estáticos.

El panel se construye como una **página client** de Next.js (`src/app/admin/page.tsx`) con componentes de formulario reutilizables, manteniendo la estética retro/minimalista de expedia/dossier que ya usa el proyecto (bordes 2px, tipografía mono, etiquetas `[ ... ]`, clases utilitarias `.card`, `.btn-primary`, `.input-base`, `.select-base`, `.badge*`).

## Modelado de Dominio e Integración

Se reutilizan **íntegramente los tipos existentes** en `src/types/corruption.ts` (familia redes):

- **Entidades / Nodos:** `CasoRed` (expediente) y `ActorRed` (actores con `tipo_actor`, `status_legal`, `organizacion`, `monto_vinculado`).
- **Conexiones / Aristas:** `ConexionRed` (relaciones con `tipo`, `descripcion`, `monto`, `periodo`), siempre entre `actor_origen_id` y `actor_destino_id` existentes del mismo caso.
- **Métricas de Perjuicio:** montos en lempiras (`monto`) y dólares (`monto_usd`) ya modelados en `CasoRed`; `monto_vinculado` por actor y `monto` por conexión.
- **Fuentes / Evidencias:** `fuente_principal` + `fuente_url` en `CasoRed` para mantener trazabilidad a investigaciones públicas (CNA, MP, prensa).

No se crean tipos nuevos: la feature aporta **operaciones** sobre el modelo existente.

### Almacenamiento mutable

- `src/lib/db/redesStore.ts` (nuevo): importa `allCasosRed`, `allActoresRed`, `allConexionesRed` de `@/data/redes` como seed y expone:
  - Lecturas: `getCasosRed()`, `getCasoRed(id)`, `getActoresRed()`, `getActoresByCaso(casoId)`, `getConexionesRed()`, `getConexionesByCaso(casoId)`, `getGraphData(casoId)`, `cargarActores()`.
  - Escritura: `createCasoRed(data)`, `updateCasoRed(id, data)`, `deleteCasoRed(id)` (borra en cascada actores y conexiones del caso); `createActorRed`, `updateActorRed`, `deleteActorRed` (borra sus conexiones); `createConexionRed`, `updateConexionRed`, `deleteConexionRed`.
  - Generador de IDs `generateId()` y validaciones de consistencia referencial.

## Pasos de Implementación

1. **Datos / Persistencia:**
   - Crear `src/lib/db/redesStore.ts` con siembra desde `@/data/redes` y CRUD completo (create/update/delete) + borrado en cascada de conexiones/actores dependientes.
   - Mantener `src/data/redes/*` intactos como semilla de datos verificados.

2. **Lógica / API:**
   - Redirect de lectura: cambiar `src/app/api/redes/casos/route.ts` y `[id]/route.ts`, `[id]/actores/route.ts`, `[id]/conexiones/route.ts`, `[id]/graph/route.ts` para que consulten `redesStore.ts` en lugar de `@/data/redes`.
   - Nuevos endpoints CRUD de administración:
     - `src/app/api/redes/admin/casos/route.ts` → POST (crear)
     - `src/app/api/redes/admin/casos/[id]/route.ts` → PUT/DELETE
     - `src/app/api/redes/admin/actores/route.ts` → POST
     - `src/app/api/redes/admin/actores/[id]/route.ts` → PUT/DELETE
     - `src/app/api/redes/admin/conexiones/route.ts` → POST
     - `src/app/api/redes/admin/conexiones/[id]/route.ts` → PUT/DELETE
   - Validar entradas en cada endpoint y devolver respuestas estructuradas (`200`/`400`/`404`/`500`).

3. **Componentes UI:**
   - Crear `src/components/admin/` con:
     - `CasoForm.tsx`, `ActorForm.tsx`, `ConexionForm.tsx` — formularios de creación/edición (inputs reutilizando `.input-base`/`.select-base`).
     - `AdminPanel.tsx` — orquestador: lista de casos, selección, gestión de actores/conexiones.
   - Crear la página `src/app/admin/page.tsx` (client) que carga el panel, con el encabezado de dossier `[ PANEL DE ADMINISTRACIÓN ]`.
   - Añadir enlace al panel en la navegación (`src/components/navigation/SiteHeader.tsx`) y conectar con el nuevo índice `src/components/admin/index.ts`.

4. **Pruebas y Validación:**
   - Tests unitarios para `redesStore.ts` (CRUD, borrado en cascada, consistencia de IDs).
   - Tests de las operaciones POST/PUT/DELETE de las rutas admin (mock de `redesStore`).
   - Ejecutar `npm test` y `npm run lint`.

## Decisiones Técnicas

- **Store en memoria (no PostgreSQL):** coherente con la capa de datos activa del proyecto (`store.ts`). Las demás entidades ya funcionan así y la DB relacional no está conectada a las rutas. Se descarta conectar pg ahora por falta de integración existente; se documenta para `011`/migración futura.
- **Un único origen de datos para pública y admin:** eliminar el doble camino (estático para `/redes`, mutable para admin) evita ediciones que no se reflejen en el grafo público. El seed inyecta las redes verificadas al arrancar; las ediciones viven en memoria durante la sesión.
- **Reutilizar tipos existentes sin añadir ninguno:** `CasoRed`/`ActorRed`/`ConexionRed` ya modelan todo lo necesario (estado procesal, montos, periodo, fuentes). Crear tipos duplicados rompería la coherencia y el rigor tipado estricto.
- **Borrado en cascada simple a nivel de store:** al eliminar un caso o actor se eliminan sus conexiones para no dejar aristas huérfanas en el grafo (`RedGraphData`).

## Riesgos y Mitigaciones

- **Pérdida de datos al reiniciar el servidor** (memoria): el panel es para sesión activa, como el resto del store. Mitigación: la semilla `src/data/redes/` permanece inmutable y verificada; se documenta como límite. La persistencia real se delega a la migración a DB.
- **Consistencia referencial rota en conexiones:** mitigado validando en el store y en los formularios que `actor_origen_id`/`actor_destino_id` existan y pertenezcan al mismo caso, más borrado en cascada.
- **Complejidad visual del formulario/mantenimiento:** mitigado con formularios modulares por entidad y reuso de la estética de tarjetas (`.card`) existente.
