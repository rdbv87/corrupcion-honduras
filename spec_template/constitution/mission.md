# Misión: Corrupción Honduras

_Define la razón de ser, alcance, principios y límites del proyecto de mapeo de redes de corrupción y cuantificación del perjuicio social en Honduras._

## Qué construimos

Una plataforma cívica, analítica y de datos abiertos que administra y visualiza redes interactivas de corrupción estructuradas por casos emblemáticos en Honduras (como el desfalco del IHSS, la compra fraudulenta de Hospitales Móviles, el caso Pandora, entre otros), cuantificando y traduciendo el perjuicio económico en daño social e institucional tangible para la ciudadanía hondureña. Todo el sistema se nutre y sustenta en información pública verificable, primordialmente los informes de investigación del Consejo Nacional Anticorrupción (CNA: https://www.cna.hn/), auditorías del TSC y requerimientos fiscales del Ministerio Público.

### Componentes Principales

1. **Gestor y Visualizador de Redes de Corrupción** — Grafos interactivos (Cytoscape.js) que mapean nodos (personas, empresas fantasma/fachada, instituciones estatales, organismos) y aristas (relaciones financieras, societarias, familiares y políticas) por cada caso emblemático.
2. **Calculador y Tablero de Perjuicio Social (KPIs)** — Módulo analítico que traduce montos desviados a su impacto directo en la sociedad: pérdida de atenciones médicas, vacunas/tratamientos no suministrados, pupitres o escuelas deterioradas, sobrecostos y vidas afectadas.
3. **Motor de Ingesta y Trazabilidad de Fuentes** — Conectores de scraping y estructuración de datos sobre portales públicos y repositorios de investigación del CNA, indexando expedientes, evidencias y enlaces directos.
4. **Línea Temporal de Eventos Judiciales** — Cronología interactiva de denuncias, aseguramientos, requerimientos fiscales, capturas y resoluciones de los tribunales anticorrupción.
5. **Asistente de Consulta Documental (RAG)** — Búsqueda contextual sobre el archivo documental de investigaciones y resoluciones públicas.

## Para quién

- **Ciudadanía hondureña**: Para comprender de forma transparente, didáctica y visual cómo opera la corrupción sistémica y cómo impacta directamente en sus derechos y servicios básicos.
- **Periodistas de investigación y medios**: Como herramienta de consulta rápida, cruce de información y verificación de expedientes documentados por el CNA.
- **Organizaciones de sociedad civil y activistas**: Para sustentar acciones de auditoría social, litigio estratégico e incidencia en políticas de transparencia e integridad.
- **Investigadores y académicos**: Como repositorio estructurado de redes complejas de poder, desvío de fondos y tipologías de corrupción en Centroamérica.

## Principios

- **Rigor documental y evidencia pública**: Toda entidad, vínculo o cifra debe estar rigurosamente sustentada en una fuente pública identificable (investigaciones del CNA, expedientes judiciales o reportes oficiales). No se admiten rumores ni información no corroborada.
- **Foco en el daño ciudadano (Perjuicio Social)**: La corrupción no es solo una cifra abstracta en Lempiras o Dólares; debe mostrarse siempre su costo humano y la merma en salud, educación, infraestructura y desarrollo.
- **Objetividad e independencia**: Presentación neutral y fidedigna de los hechos sustentados en las investigaciones oficiales y del CNA, sin sesgos partidarios ni adjetivos difamatorios.
- **Datos Abiertos y Accesibilidad**: Arquitectura abierta, exportable en formatos estándar (JSON, CSV, GraphML) y visualmente intuitiva tanto en móviles como en escritorio.

## Qué NO es

- **No es una red social de denuncias anónimas**: No procesa rumores no sustentados ni señalamientos sin expediente o investigación respaldada por entidades formales (CNA, MP, etc.).
- **No es un tribunal judicial**: La plataforma presenta y organiza investigaciones y datos públicos con fines pedagógicos y cívicos, respetando el estado procesal y los términos legales de cada caso.
- **No es una herramienta de propaganda partidaria**: Su fin es la transparencia, la memoria histórica y la lucha contra la impunidad en Honduras.
