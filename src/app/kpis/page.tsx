'use client';

import { useEffect, useState } from 'react';
import { KPIDashboard, KPITimeline } from '@/components/kpi';
import { KPIDataPoint, KPIIndicator } from '@/types/corruption';

export default function KPIsPage() {
  const [indicators, setIndicators] = useState<KPIIndicator[]>([]);
  const [data, setData] = useState<KPIDataPoint[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<KPIIndicator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const [indicatorsResponse, dataResponse] = await Promise.all([
          fetch('/api/kpi/indicators'),
          fetch('/api/kpi/data'),
        ]);
        setIndicators(await indicatorsResponse.json());
        setData(await dataResponse.json());
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-[#f5f3ec] dark:bg-[#121316] transition-colors py-8 sm:py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171] block mb-1">
            [ IMPACTO CIUDADANO & SOCIEDAD ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1c1917] dark:text-[#f4f4f5] sm:text-4xl">
            Perjuicio Social de la Corrupción
          </h1>
          <p className="mt-2 text-sm font-mono text-[#57534e] dark:text-[#a1a1aa]">
            Cuantificación del daño ocasionado por el desvío de recursos públicos en salud, educación, infraestructura y desarrollo en Honduras.
          </p>
        </div>

        <div className="card p-4 sm:p-6">
          {isLoading ? (
            <p className="py-12 text-center font-mono text-xs text-[#78716c] dark:text-[#a1a1aa]">[ CARGANDO INDICADORES DE IMPACTO... ]</p>
          ) : selectedIndicator ? (
            <div>
              <button
                onClick={() => setSelectedIndicator(null)}
                className="btn-secondary text-xs mb-4"
              >
                &larr; Volver a Todos los Indicadores
              </button>
              <KPITimeline
                indicator={selectedIndicator}
                data={data.filter((item) => item.indicator_id === selectedIndicator.id)}
              />
            </div>
          ) : (
            <KPIDashboard indicators={indicators} data={data} onSelectIndicator={setSelectedIndicator} />
          )}
        </div>
      </section>
    </main>
  );
}