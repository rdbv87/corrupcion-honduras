'use client';

import { useState, useEffect } from 'react';
import { KPIIndicator, KPIDataPoint, AreaImpacto } from '@/types/corruption';
import KPIAreaCard from './KPIAreaCard';

interface KPIDashboardProps {
  indicators: KPIIndicator[];
  data: KPIDataPoint[];
  onSelectIndicator?: (indicator: KPIIndicator) => void;
}

const areaLabels: Record<AreaImpacto, string> = {
  salud: 'Salud',
  educacion: 'Educación',
  empleo: 'Empleo y Pobreza',
  infraestructura: 'Infraestructura',
  tecnologia: 'Tecnología',
  general: 'Corrupción y Desarrollo',
};

const areaIcons: Record<AreaImpacto, string> = {
  salud: '🏥',
  educacion: '📚',
  empleo: '💼',
  infraestructura: '🏗️',
  tecnologia: '💻',
  general: '📊',
};

export default function KPIDashboard({ indicators, data, onSelectIndicator }: KPIDashboardProps) {
  const [selectedArea, setSelectedArea] = useState<AreaImpacto | 'all'>('all');

  const areas: AreaImpacto[] = ['salud', 'educacion', 'empleo', 'infraestructura', 'tecnologia', 'general'];

  const filteredIndicators = selectedArea === 'all'
    ? indicators
    : indicators.filter((i) => i.area === selectedArea);

  const getIndicatorData = (indicatorId: string) =>
    data.filter((d) => d.indicator_id === indicatorId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]" role="group" aria-label="Filtrar por área">
        <button
          onClick={() => setSelectedArea('all')}
          className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
            selectedArea === 'all'
              ? 'border-[#1c1917] bg-[#1c1917] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] shadow-retro-sm dark:shadow-none'
              : 'border-[#1c1917] bg-[#faf8f2] text-[#1c1917] hover:bg-[#ede9df] dark:border-[#3f3f46] dark:bg-[#1a1c22] dark:text-[#f4f4f5]'
          }`}
        >
          [ TODAS LAS ÁREAS ]
        </button>
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
              selectedArea === area
                ? 'border-[#1c1917] bg-[#1c1917] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] shadow-retro-sm dark:shadow-none'
                : 'border-[#1c1917] bg-[#faf8f2] text-[#1c1917] hover:bg-[#ede9df] dark:border-[#3f3f46] dark:bg-[#1a1c22] dark:text-[#f4f4f5]'
            }`}
          >
            {areaLabels[area]}
          </button>
        ))}
      </div>

      {areas
        .filter((area) => selectedArea === 'all' || selectedArea === area)
        .map((area) => {
          const areaIndicators = filteredIndicators.filter((i) => i.area === area);
          if (areaIndicators.length === 0) return null;

          return (
            <section key={area} aria-labelledby={`area-${area}`} className="space-y-3">
              <div className="flex items-center gap-2 border-l-4 border-[#1c1917] pl-2.5 dark:border-[#f4f4f5]">
                <h3
                  id={`area-${area}`}
                  className="text-sm font-mono font-bold uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5]"
                >
                  SECTOR: {areaLabels[area]}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {areaIndicators.map((indicator) => (
                  <KPIAreaCard
                    key={indicator.id}
                    indicator={indicator}
                    data={getIndicatorData(indicator.id)}
                    onClick={onSelectIndicator}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
