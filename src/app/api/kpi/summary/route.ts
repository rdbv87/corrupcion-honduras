import { NextResponse } from 'next/server';
import { kpiIndicators, allKPIData } from '@/data/kpi';
import { AreaImpacto, KPISummary } from '@/types/corruption';

export async function GET() {
  const areas: AreaImpacto[] = ['salud', 'educacion', 'empleo', 'infraestructura', 'tecnologia', 'general'];

  const summary: KPISummary[] = areas.map((area) => {
    const areaIndicators = kpiIndicators.filter((i) => i.area === area);
    const areaData = allKPIData.filter((d) =>
      areaIndicators.some((i) => i.id === d.indicator_id)
    );

    const latestByIndicator = areaIndicators.map((ind) => {
      const points = areaData
        .filter((d) => d.indicator_id === ind.id)
        .sort((a, b) => b.year - a.year);
      return points[0];
    }).filter(Boolean);

    const lastPoint = latestByIndicator.sort((a, b) => b!.year - a!.year)[0];

    const firstPoint = areaData
      .filter((d) => d.indicator_id === latestByIndicator[0]?.indicator_id)
      .sort((a, b) => a.year - b.year)[0];

    let tendencia: 'sube' | 'baja' | 'estable' = 'estable';
    if (lastPoint && firstPoint && lastPoint.indicator_id === firstPoint.indicator_id) {
      const diff = lastPoint.value - firstPoint.value;
      if (Math.abs(diff) > 0.5) {
        tendencia = diff > 0 ? 'sube' : 'baja';
      }
    }

    return {
      area,
      indicadores: areaIndicators.length,
      ultimo_valor: lastPoint?.value ?? 0,
      ultimo_anio: lastPoint?.year ?? 0,
      tendencia,
    };
  });

  return NextResponse.json(summary);
}
