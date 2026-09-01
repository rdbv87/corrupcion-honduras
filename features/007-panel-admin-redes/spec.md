# 007 · Panel de Administración y Edición de Redes

**Estado:** implementado ✅
**Caso / Módulo:** Panel de administración de redes de casos emblemáticos

## Qué hace

Proporciona una **interfaz administrativa** dedicada para registrar, editar, relacionar y eliminar los elementos que componen las redes de corrupción de los casos emblemáticos. La analista de datos podrá:

- **Gestionar casos emblemáticos** (`CasoRed`): crear un nuevo expediente, editar sus metadatos (título, subtítulo, periodo, montos en lempiras/USD, descripción, estado judicial) y eliminarlo.
- **Gestionar actores** (`ActorRed`): registrar personas, empresas, testaferros, etc., asignar su **estado procesal** (`condenado`, `procesado`, `pro_fugo`, `investigado`, `absuelto`), rol, organización y monto vinculado.
- **Gestionar conexiones** (`ConexionRed`): establecer y actualizar las relaciones entre actores (tipo, descripción, monto, periodo), manteniendo la coherencia de la red de grafo.
- **Actualizar evidencias / trazabilidad**: asociar a cada caso su fuente pública principal (título y URL verificable), cumpliendo el rigor documental del proyecto.

Todo cambio se refleja de inmediato en la visualización pública de redes (`/redes`) y en el grafo, ya que el panel opera sobre el **mismo origen de datos** que consume esa vista.

## Por qué

Hoy los datos de las redes de los casos emblemáticos (IHSS, Hospitales Móviles, Pandora) viven como **archivos TypeScript estáticos** en `src/data/redes/*.ts` y se sirven de forma **solo lectura**. Para incorporar un caso nuevo (p. ej. un informe reciente del CNA detectado por la feature `006`) o actualizar el estado procesal de un actor tras un requerimiento fiscal o sentencia, una persona debe editar código a mano y reiniciar. Esto no escala ni mantiene la trazabilidad.

Este panel resuelve ese vacío y sienta las bases para el roadmap: alimenta la búsqueda (`011`), la calculadora de perjuicio (`008`) y el cruce multi-caso (`012`), que dependerán de un almacén de redes actualizable y verificable.

## Fuentes Públicas de Respaldo

- **Fuente 1:** Consejo Nacional Anticorrupción (CNA) — Investigaciones: `https://www.cna.hn/investigaciones/`
- **Fuente 2:** Informes del CNA (PDF): `https://www.cna.hn/informes/`
- **Fuente 3:** Casos ya documentados con enlaces en `src/data/redes/` (El Heraldo, La Prensa, Proceso Digital, Bloomberg Línea, Expediente Público).

## Criterios de Aceptación

- [x] Existe un nuevo store mutable (`src/lib/db/redesStore.ts`) que inicializa los datos de `src/data/redes/` y expone operaciones de lectura y escritura (create/update/delete) para `CasoRed`, `ActorRed` y `ConexionRed`, persistiendo en memoria durante la sesión.
- [x] Existen endpoints API CRUD (`/api/redes/admin/casos`, `/actores`, `/conexiones` con sus `[id]`) que permiten crear, leer, actualizar y eliminar cada entidad, con validación de entrada y respuestas estructuradas.
- [x] La vista pública existente (`/redes` y sus APIs `/api/redes/casos`, `/graph`, `/actores`, `/conexiones`) se renombra para leer del nuevo store en lugar de los archivos estáticos directos.
- [x] Existe una página `/admin` con UI retro/minimalista (acorde a los estilos del proyecto) que permite: listar casos, crear uno nuevo, editar sus metadatos y fuentes, y administrar actores y conexiones de cada caso.
- [x] Se respetan los tipos estrictos (`CasoRed`, `ActorRed`, `ConexionRed`) sin uso injustificado de `any`; las operaciones de red no rompen la consistencia referencial (una conexión siempre apunta a actores existentes).
- [x] `npm run lint` y `npm test` pasan tras los cambios.

## Fuera de Alcance

- **Persistencia en PostgreSQL** — el panel usa un store en memoria (como la capa activa actual), coherente con el resto del proyecto; la migración a la DB relacional queda fuera.
- **Autenticación / control de acceso** — la ruta admin es accesible en la instancia; la autorización para publicación oficial se aborda aparte.
- **Edición de los datos del modelo relacional genérico** (casos/entidades/conexiones de `store.ts`) — el panel se enfoca en el dominio de casos emblemáticos.
- **Cuantificación de perjuicio social** (feature `008`) y **búsqueda semántica RAG** (`011`) — solo se prepara el almacén para alimentarlas.
