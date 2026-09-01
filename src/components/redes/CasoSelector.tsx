'use client';

import { CasoRed } from '@/types/corruption';

interface CasoSelectorProps {
  casos: CasoRed[];
  selectedId?: string;
  onSelect: (caso: CasoRed) => void;
}

const statusColors: Record<string, string> = {
  'condenado': 'bg-[#fef2f2] text-[#b91c1c] border-[#b91c1c] dark:bg-[#7f1d1d]/20 dark:text-[#fca5a5]',
  'procesado': 'bg-[#fffbeb] text-[#b45309] border-[#b45309] dark:bg-[#78350f]/20 dark:text-[#fde047]',
  'pro_fugo': 'bg-[#fff7ed] text-[#c2410c] border-[#c2410c] dark:bg-[#7c2d12]/20 dark:text-[#fdba74]',
  'investigado': 'bg-[#eff6ff] text-[#1d4ed8] border-[#1d4ed8] dark:bg-[#1e3a8a]/20 dark:text-[#93c5fd]',
  'absuelto': 'bg-[#f0fdf4] text-[#15803d] border-[#15803d] dark:bg-[#14532d]/20 dark:text-[#86efac]',
};

export default function CasoSelector({ casos, selectedId, onSelect }: CasoSelectorProps) {
  return (
    <div className="space-y-3">
      {casos.map((caso) => (
        <button
          key={caso.id}
          onClick={() => onSelect(caso)}
          className={`w-full text-left card p-4 transition-all ${
            selectedId === caso.id
              ? 'border-2 border-[#1c1917] bg-[#f5f3ec] dark:border-[#f4f4f5] dark:bg-[#242730] shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] dark:shadow-none translate-x-0.5 -translate-y-0.5'
              : 'hover:border-[#1c1917] dark:hover:border-[#71717a]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block mb-0.5">
                [ EXPEDIENTE #{caso.id.toUpperCase()} ]
              </span>
              <h3 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] text-sm leading-snug">
                {caso.titulo}
              </h3>
              <p className="text-xs text-[#57534e] dark:text-[#a1a1aa] mt-1 line-clamp-2">
                {caso.subtitulo}
              </p>
            </div>
            <div className="text-right shrink-0 border-l-2 border-[#1c1917]/20 pl-2.5 dark:border-[#3f3f46]">
              <span className="text-base font-mono font-black text-[#b91c1c] dark:text-[#f87171]">
                ${(caso.monto_usd / 1000000).toFixed(1)}M
              </span>
              <span className="block text-[10px] font-mono tracking-wider uppercase text-[#78716c] dark:text-[#a1a1aa]">
                USD DESVIADO
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-dashed border-[#1c1917]/20 dark:border-[#3f3f46] flex items-center justify-between text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">
            <span>{caso.periodo}</span>
            <span className="font-semibold text-[#1c1917] dark:text-[#d4d4d8]">
              {caso.status_judicial.substring(0, 35)}{caso.status_judicial.length > 35 ? '...' : ''}
            </span>
          </div>

          {selectedId === caso.id && (
            <p className="mt-3 text-xs text-[#44403c] dark:text-[#d4d4d8] leading-relaxed border-t border-[#1c1917]/10 dark:border-[#3f3f46] pt-2">
              {caso.descripcion_corta}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

export { statusColors };
