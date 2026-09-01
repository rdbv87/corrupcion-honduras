# 007 · Panel de Administración y Edición de Redes — Tareas

_Checklist de tareas de implementación derivado de `plan.md`. Tareas atómicas y verificables; marcar `[x]` al completarlas._

## 1. Datos y Persistencia
- [x] Crear `src/lib/db/redesStore.ts` que siembra desde `@/data/redes` (allCasosRed, allActoresRed, allConexionesRed) y expone CRUD completo.
- [x] Implementar generación de IDs y borrado en cascada (caso → actores/conexiones; actor → conexiones).
- [x] Implementar lecturas de apoyo para grafo y visibilidad pública: `getActoresByCaso`, `getConexionesByCaso`, `getGraphData`.
- [x] Mantener `src/data/redes/*` intactos como semilla de datos verificados.

## 2. Lógica y Backend / APIs
- [x] Redirigir las rutas de lectura existentes (`/api/redes/casos`, `[id]`, `[id]/actores`, `[id]/conexiones`, `[id]/graph`) para consultar `redesStore` en lugar de `@/data/redes`.
- [x] Crear `POST src/app/api/redes/admin/casos/route.ts` (crear caso).
- [x] Crear `PUT/DELETE src/app/api/redes/admin/casos/[id]/route.ts`.
- [x] Crear `POST src/app/api/redes/admin/actores/route.ts` y `PUT/DELETE .../actores/[id]/route.ts`.
- [x] Crear `POST src/app/api/redes/admin/conexiones/route.ts` y `PUT/DELETE .../conexiones/[id]/route.ts`.
- [x] Validar entradas (campos requeridos, tipos, consistencia de IDs) y devolver respuestas estructuradas `400`/`404`.

## 3. Interfaz de Usuario y Visualización
- [x] Crear `src/components/admin/` con `CasoForm.tsx`, `ActorForm.tsx`, `ConexionForm.tsx` y `AdminPanel.tsx`.
- [x] Crear `src/components/admin/index.ts` (barrel).
- [x] Crear la página `src/app/admin/page.tsx` (client) con encabezado de dossier `[ PANEL DE ADMINISTRACIÓN ]`.
- [x] Añadir enlace al panel en `src/components/navigation/SiteHeader.tsx`.
- [x] Verificar soporte responsivo y modos claro/oscuro.

## 4. Pruebas y Control de Calidad
- [x] Escribir tests unitarios para `redesStore.ts` (CRUD, borrado en cascada, consistencia).
- [x] Escribir tests para las operaciones POST/PUT/DELETE de las rutas admin.
- [x] Ejecutar `npm test` y comprobar que todos pasen.
- [x] Ejecutar `npm run lint` (tipos estrictos, sin `any` injustificado).

## 5. Cierre y Documentación
- [x] Validar el cumplimiento estricto de los criterios de aceptación en `spec.md`.
- [x] Actualizar `docs/HISTORIAL.md` con las decisiones y avances realizados.
- [x] Mover la feature 007 a "Hecho ✅" en `../../spec_template/constitution/roadmap.md`.
