# Roadmap del Proyecto

_Plan de evolución y estado de las features de la plataforma Corrupción Honduras. Organizado por orden de prioridad para consolidar la administración de redes y la cuantificación del perjuicio social._

## Hecho ✅

1. **001 · Estructura Base y Modelado de Datos** — Definición de tipos TypeScript (`Caso`, `Entidad`, `Conexion`, `Fuente`, `Impacto`), esquema relacional PostgreSQL y capa de persistencia/store en memoria.
2. **002 · Visualizador de Grafos de Red con Cytoscape.js** — Renderizado dinámico de redes de corrupción con soporte para selección de actores, inspección de conexiones e interactividad visual.
3. **003 · Casos Emblemáticos Iniciales** — Datasets estructurados y documentados para casos de alto impacto: *Desfalco del IHSS*, *Compra Fraudulenta de Hospitales Móviles* y *Caso Pandora*.
4. **004 · Módulo de Perjuicio Social y KPIs** — Visualización del perjuicio económico cuantificado y su impacto sectorial en salud, educación e infraestructura.
5. **005 · Motor Inicial de Scraping** — Scraper base para portales de noticias y fuentes oficiales con control de tasa y extracción de metadatos.
6. **006 · Conector Especializado de Informes CNA (https://www.cna.hn/)** — Extractor e indexador automático de informes de investigación, líneas de denuncia, montos de perjuicio y expedientes del Consejo Nacional Anticorrupción.

## Siguiente 🔜

7. **007 · Panel de Administración y Edición de Redes** — Interfaz administrativa para registrar, editar, relacionar entidades y actualizar el estado procesal y las evidencias de cada caso emblemático.
8. **008 · Calculadora Dinámica de Perjuicio Social a la Población** — Herramienta interactiva que permite a la ciudadanía calcular la equivalencia del dinero desfalcado en medicamentos, camas UCI, escuelas o raciones de alimentos.

## Backlog / Ideas 💡

- **009 · Módulo de Línea Temporal Judicial Interactiva** — Cronología detallada de requerimientos fiscales, aseguramientos de bienes y sentencias de los tribunales anticorrupción.
- **010 · Exportador de Grafos y Datos Abiertos** — Descarga de redes en formato GraphML, JSON, CSV y reportes ejecutivos en PDF para periodistas y analistas.
- **011 · Búsqueda Semántica y Asistente RAG de Expedientes** — Integración con backend FastAPI y ChromaDB para responder consultas ciudadanas con citas textuales a las investigaciones del CNA.
- **012 · Cruce Multi-Caso de Actores y Empresas Reincidentes** — Detección automática de empresas de maletín o testaferros que aparecen en más de un caso de corrupción en Honduras.

> Toda feature nueva se desarrolla creando su carpeta en `features/NNN-nombre-feature/` con `spec.md`, `plan.md` y `tasks.md` antes de implementar el código.
