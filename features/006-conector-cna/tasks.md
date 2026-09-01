# 006 · Conector Especializado de Informes CNA — Tareas

_Checklist de tareas de implementación derivado de `plan.md`. Tareas atómicas y verificables; marcar `[x]` al completarlas._

## 1. Datos y Fuentes
- [x] Registrar la fuente CNA en `src/lib/scraper/sources.ts` (`id: 'cna'`, `name: 'Consejo Nacional Anticorrupción'`, `type: 'informe'`, `baseUrl: 'https://www.cna.hn/'`, `listUrl: 'https://www.cna.hn/investigaciones/'`, `rateLimitMs: 4000`).
- [x] Ampliar `SourceType` en `src/types/corruption.ts` con el valor `'informe'` manteniendo los valores existentes.

## 2. Lógica y Backend / APIs
- [x] Crear `src/lib/scraper/cna.ts` con:
  - [x] Parsing extendido que captura `pdfUrl` (enlace de descarga del informe) además de título, fecha, resumen y URL.
  - [x] Función `detectMontos(contenido)` con regex conservadoras para Lempiras (`L`, `LPS`) y USD (`$`, `US$`, `USD`).
- [x] Extender `ScrapeResult` en `src/lib/scraper/types.ts` con campos opcionales `pdfUrl?: string` y `montosDetectados?: string[]`.
- [x] Exportar el conector y `detectMontos` desde `src/lib/scraper/index.ts`.
- [x] Actualizar `src/app/api/scrape/run/route.ts` para que, cuando `sourceId === 'cna'`, consolide las entradas con `tipo: 'informe'` y `confiabilidad: 0.95` en `src/lib/db/store.ts` (reutilizando la deduplicación por URL existente) y reporte los montos detectados.
- [x] Verificar manejo de errores: si el portal no responde, respuesta estructurada `500`/mensaje claro sin romper el proceso.

## 3. Interfaz de Usuario y Visualización
- [x] Confirmar que la fuente CNA aparece disponible en el selector/panel de fuentes existente (`/api/scrape/sources`).
- [x] (Opcional) Marcar visualmente las entradas indexadas como `[ INFORME CNA ]`.

## 4. Pruebas y Control de Calidad
- [x] Escribir tests unitarios para `detectMontos` (casos Lempiras, USD, sin monto) y para el parsing con un HTML de ejemplo del CNA (mock de `fetchHtml`).
- [x] Ejecutar `npm test` y comprobar que todos los tests pasen.
- [x] Ejecutar `npm run lint` para garantizar cumplimiento de tipos estrictos (sin `any` injustificado).

## 5. Cierre y Documentación
- [x] Validar el cumplimiento de todos los criterios de aceptación en `spec.md`.
- [x] Actualizar `docs/HISTORIAL.md` con las decisiones y avances realizados.
- [x] Mover la feature 006 a "Hecho ✅" en `../../spec_template/constitution/roadmap.md`.
