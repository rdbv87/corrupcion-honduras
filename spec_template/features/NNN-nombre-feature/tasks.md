# NNN · <Nombre de la feature o caso> — Tareas

_Checklist de tareas de implementación derivado de `plan.md`. Tareas atómicas y verificables; marcar `[x]` al completarlas._

## 1. Datos y Fuentes
- [ ] Recopilar y verificar fuentes públicas e informes del CNA (https://www.cna.hn/) o documentos oficiales.
- [ ] Definir o actualizar el dataset estructurado en `src/data/` respetando los tipos de `src/types/corruption.ts`.
- [ ] Enlazar cada entidad, conexión y cifra de impacto con su correspondiente objeto `Fuente`.

## 2. Lógica y Backend / APIs
- [ ] Crear o actualizar rutas de API necesarias en `src/app/api/`.
- [ ] Validar esquema y persistencia en base de datos / store local.
- [ ] Si aplica ingesta web, implementar o adaptar el conector en `src/lib/scraper/` con rate limiting y manejo de errores.

## 3. Interfaz de Usuario y Visualización
- [ ] Crear o actualizar los componentes visuales en `src/components/` (redes, KPIs o timeline).
- [ ] Configurar layout y estilos del grafo en Cytoscape para representar claramente los roles y tipos de actores.
- [ ] Verificar soporte responsivo y modos claro/oscuro.

## 4. Pruebas y Control de Calidad
- [ ] Escribir o actualizar tests unitarios para la lógica de cálculo o renderizado.
- [ ] Ejecutar `npm test` y comprobar que todos los tests pasen exitosamente.
- [ ] Ejecutar `npm run lint` para garantizar cumplimiento de tipos estrictos y estándares de código.

## 5. Cierre y Documentación
- [ ] Validar el cumplimiento estricto de todos los criterios de aceptación en `spec.md`.
- [ ] Actualizar `docs/HISTORIAL.md` con las decisiones y avances realizados.
- [ ] Mover la feature a "Hecho ✅" en `../../constitution/roadmap.md`.
