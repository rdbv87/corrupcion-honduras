import { KPIDataPoint } from '@/types/corruption';

/**
 * Series de la dimensión institucional de la lucha anticorrupción en Honduras,
 * según cifras publicadas por el Consejo Nacional Anticorrupción (CNA).
 *
 * Los valores provienen de los reportes públicos del CNA (informes de gestión,
 * dashboard institucional y nota de la Unidad de Investigación). Se registran
 * solo cifras verificables; ante dudas se usa el total acumulado documentado.
 */
export const institucionalData: KPIDataPoint[] = [
  // Casos presentados (líneas de investigación) por el CNA ante el Ministerio Público.
  // Desde su creación el CNA acumula 170+ casos; la serie refleja el acumulado por corte documentado.
  { indicator_id: 'cna-casos-presentados', year: 2014, value: 13 },
  { indicator_id: 'cna-casos-presentados', year: 2017, value: 67, notas: 'Acumulado 2014–2017' },
  { indicator_id: 'cna-casos-presentados', year: 2019, value: 85, notas: 'Acumulado; 18 casos nuevos en 2019 (L606M)' },
  { indicator_id: 'cna-casos-presentados', year: 2025, value: 170, notas: 'Más de 170 casos presentados desde 2014' },

  // Casos judicializados: pocos de los presentados llegan a juicio.
  { indicator_id: 'cna-casos-judicializados', year: 2017, value: 15, notas: '15 de 88 casos judicializados al 2017' },
  { indicator_id: 'cna-casos-judicializados', year: 2025, value: 33, notas: 'Aprox. 33 casos judicializados del total acumulado' },

  // Casos en impunidad: la gran mayoría no se judicializa.
  { indicator_id: 'cna-casos-impunidad', year: 2017, value: 73, notas: '73 de 88 casos en impunidad al 2017' },

  // Perjuicio económico identificado acumulado (en millones de Lempiras).
  // Aproximación conservadora basada en los reportes del CNA.
  { indicator_id: 'cna-perjuicio-identificado', year: 2017, value: 2945, notas: 'L.2,945M identificados 2014–2017' },
  { indicator_id: 'cna-perjuicio-identificado', year: 2025, value: 13500, notas: 'Acumulado histórico, incluye desfalcados emblemáticos (IHSS, Hospitales Móviles, Pandora, PRAF)' },
];
