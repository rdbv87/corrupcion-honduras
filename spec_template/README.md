# spec/ — Marco de Desarrollo Dirigido por Especificación (SDD)

> Marco de especificación (Spec-Driven Development) para la plataforma **Corrupción Honduras (corrupcion-hn)**.
> Todo desarrollo sigue el principio fundamental: **primero la especificación (`spec.md`), luego el diseño técnico (`plan.md`), luego el desglose de tareas (`tasks.md`), y finalmente la implementación en código verificada con fuentes públicas.**

## Estructura

```
spec/ (o spec_template/)
├── constitution/            ← Reglas estables y acuerdos rectores del proyecto
│   ├── mission.md           ← Propósito: mapeo de redes de corrupción y cuantificación del perjuicio social
│   ├── tech-stack.md        ← Stack tecnológico (Next.js, Cytoscape, FastAPI, Scraper CNA) y convenciones
│   └── roadmap.md           ← Orden de implementación de casos emblemáticos y módulos funcionales
└── features/                ← Especificaciones por caso o módulo funcional
    └── NNN-nombre-feature/
        ├── spec.md          ← Definición de requerimientos, datos de respaldo y criterios de aceptación
        ├── plan.md          ← Estrategia técnica, modelos de grafo/KPI y contratos API
        └── tasks.md         ← Checklist de tareas de implementación y validación
```

## Flujo de Trabajo para una Feature / Caso Nuevo

1. **Crear directorio**: `features/NNN-nombre-feature/` con el correlativo correspondiente (`001`, `002`, ...).
2. **Escribir `spec.md`**: Definir el objetivo, los actores o módulos involucrados, el cálculo del perjuicio social y las fuentes públicas oficiales de respaldo (prioritariamente informes del CNA: https://www.cna.hn/).
3. **Escribir `plan.md`**: Definir el modelado de nodos/aristas en Cytoscape, endpoints API, esquema de persistencia y lógica de cálculo respetando `constitution/tech-stack.md`.
4. **Desglosar en `tasks.md`**: Crear checklist de tareas atómicas (modelado, scraping/datos, UI, tests).
5. **Implementar y Validar**: Ejecutar pruebas (`npm test`), revisión de tipos/linter (`npm run lint`) y verificar que todos los datos tengan trazabilidad a sus fuentes.
6. **Actualizar Roadmap**: Marcar la feature como completada en `constitution/roadmap.md`.

> **Jerarquía constitucional**: La constitución manda. Si una propuesta contradice los principios de `mission.md` (como incluir datos no verificables o prescindir de fuentes) o `tech-stack.md`, se debe ajustar la propuesta, no relajar los estándares del proyecto.
