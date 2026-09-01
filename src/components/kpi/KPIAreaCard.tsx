'use client';

import { KPIIndicator, KPIDataPoint } from '@/types/corruption';

interface KPIAreaCardProps {
  indicator: KPIIndicator;
  data: KPIDataPoint[];
  onClick?: (indicator: KPIIndicator) => void;
}

export default function KPIAreaCard({ indicator, data, onClick }: KPIAreaCardProps) {
  const sorted = [...data].sort((a, b) => a.year - b.year);
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const change = previous ? ((latest.value - previous.value) / previous.value) * 100 : 0;
  const changeFormatted = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

  const minVal = Math.min(...sorted.map((d) => d.value));
  const maxVal = Math.max(...sorted.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const svgWidth = 110;
  const svgHeight = 35;
  const points = sorted.map((d, i) => {
    const x =
      sorted.length === 1
        ? svgWidth / 2
        : (i / (sorted.length - 1)) * svgWidth;
    const y = svgHeight - ((d.value - minVal) / range) * svgHeight;
    return `${x},${y}`;
  });

  return (
    <button
      onClick={() => onClick?.(indicator)}
      className="card p-4 hover:border-[#1c1917] hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] dark:hover:border-[#f4f4f5] dark:hover:shadow-none transition-all text-left w-full group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] leading-tight">
          {indicator.nombre}
        </span>
        <span
          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 border ${
            change > 0
              ? indicator.id === 'cpi-score' || indicator.id === 'idh'
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#15803d] dark:bg-[#14532d]/20 dark:text-[#86efac]'
                : 'bg-[#fef2f2] text-[#b91c1c] border-[#b91c1c] dark:bg-[#7f1d1d]/20 dark:text-[#fca5a5]'
              : indicator.id === 'cpi-score' || indicator.id === 'idh' || indicator.id === 'mortalidad-infantil' || indicator.id === 'tasa-abandono' || indicator.id === 'desempleo' || indicator.id === 'informalidad' || indicator.id === 'pobreza-550'
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#15803d] dark:bg-[#14532d]/20 dark:text-[#86efac]'
                : 'bg-[#fef2f2] text-[#b91c1c] border-[#b91c1c] dark:bg-[#7f1d1d]/20 dark:text-[#fca5a5]'
          }`}
        >
          {changeFormatted}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3 mt-1">
        <div>
          <span className="text-2xl font-mono font-black text-[#1c1917] dark:text-[#f4f4f5]">
            {latest.value < 1 && indicator.id === 'idh'
              ? latest.value.toFixed(3)
              : latest.value < 10
                ? latest.value.toFixed(1)
                : Math.round(latest.value).toLocaleString('es-HN')}
          </span>
          <span className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa] ml-1">
            {indicator.unidad}
          </span>
          <span className="block text-[10px] font-mono uppercase text-[#a8a29e] dark:text-[#71717a] mt-0.5">
            [ REGISTRO {latest.year} ]
          </span>
        </div>

        <svg
          width={svgWidth}
          height={svgHeight}
          className="shrink-0"
          aria-hidden="true"
        >
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="#1c1917"
            strokeWidth="2"
            className="dark:stroke-[#f4f4f5]"
          />
        </svg>
      </div>

      <p className="text-[10px] font-mono text-[#78716c] dark:text-[#a1a1aa] mt-2 truncate">
        Fuente: {indicator.fuente}
      </p>
    </button>
  );
}
