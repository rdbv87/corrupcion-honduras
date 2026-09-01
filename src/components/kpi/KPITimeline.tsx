'use client';

import { KPIIndicator, KPIDataPoint } from '@/types/corruption';

interface KPITimelineProps {
  indicator: KPIIndicator;
  data: KPIDataPoint[];
}

export default function KPITimeline({ indicator, data }: KPITimelineProps) {
  const sorted = [...data].sort((a, b) => a.year - b.year);

  if (sorted.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
        No hay datos disponibles para este indicador.
      </div>
    );
  }

  const values = sorted.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const svgWidth = 700;
  const svgHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const points = sorted.map((d, i) => ({
    x: padding.left + (i / (sorted.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minVal) / range) * chartHeight,
    year: d.year,
    value: d.value,
    notas: d.notas,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `${points[0].x},${padding.top + chartHeight} ${polylinePoints} ${points[points.length - 1].x},${padding.top + chartHeight}`;

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => minVal + (range * i) / yTicks);

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b-2 border-[#1c1917] pb-3 dark:border-[#3f3f46]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
            [ EVOLUCIÓN HISTÓRICA ]
          </span>
          <h4 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] text-base">{indicator.nombre}</h4>
          <p className="text-xs text-[#57534e] dark:text-[#a1a1aa]">{indicator.descripcion}</p>
        </div>
        <a
          href={indicator.fuente_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-bold text-[#b91c1c] dark:text-[#fca5a5] hover:underline"
        >
          [ FUENTE: {indicator.fuente} ]
        </a>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px]"
          role="img"
          aria-label={`Gráfica de ${indicator.nombre}`}
        >
          {yTickValues.map((val, i) => {
            const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  className="text-[#e7e3d8] dark:text-[#3f3f46]"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#78716c] dark:fill-[#a1a1aa] font-mono text-[10px]"
                >
                  {val < 1 && indicator.id === 'idh' ? val.toFixed(3) : val < 10 ? val.toFixed(1) : Math.round(val)}
                </text>
              </g>
            );
          })}

          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#1c1917"
            strokeWidth="2.5"
            className="dark:stroke-[#f4f4f5]"
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#b91c1c"
                stroke="#1c1917"
                strokeWidth="2"
                className="dark:stroke-[#f4f4f5]"
              />
              <text
                x={p.x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="fill-[#78716c] dark:fill-[#a1a1aa] font-mono text-[10px]"
              >
                {p.year}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
