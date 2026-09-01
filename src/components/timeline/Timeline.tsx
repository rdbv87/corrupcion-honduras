'use client';

import { EventoTemporal, EventoTemporalType, Caso } from '@/types/corruption';

const tipoColores: Record<EventoTemporalType, { bg: string; text: string; border: string; dot: string }> = {
  investigacion: { bg: 'bg-[#eff6ff] dark:bg-[#1e3a8a]/20', text: 'text-[#1d4ed8] dark:text-[#93c5fd]', border: 'border-[#1d4ed8]', dot: 'bg-[#1d4ed8]' },
  sentencia: { bg: 'bg-[#fef2f2] dark:bg-[#7f1d1d]/20', text: 'text-[#b91c1c] dark:text-[#fca5a5]', border: 'border-[#b91c1c]', dot: 'bg-[#b91c1c]' },
  denuncia: { bg: 'bg-[#fffbeb] dark:bg-[#78350f]/20', text: 'text-[#b45309] dark:text-[#fde047]', border: 'border-[#b45309]', dot: 'bg-[#b45309]' },
  resolucion: { bg: 'bg-[#f0fdf4] dark:bg-[#14532d]/20', text: 'text-[#15803d] dark:text-[#86efac]', border: 'border-[#15803d]', dot: 'bg-[#15803d]' },
  comparecencia: { bg: 'bg-[#faf5ff] dark:bg-[#581c87]/20', text: 'text-[#7e22ce] dark:text-[#d8b4fe]', border: 'border-[#7e22ce]', dot: 'bg-[#7e22ce]' },
  'medida cautelar': { bg: 'bg-[#fff7ed] dark:bg-[#7c2d12]/20', text: 'text-[#c2410c] dark:text-[#fdba74]', border: 'border-[#c2410c]', dot: 'bg-[#c2410c]' },
  otro: { bg: 'bg-[#f5f5f4] dark:bg-[#27272a]', text: 'text-[#57534e] dark:text-[#d4d4d8]', border: 'border-[#78716c]', dot: 'bg-[#78716c]' },
};

const tipoLabels: Record<EventoTemporalType, string> = {
  investigacion: 'Investigación',
  sentencia: 'Sentencia',
  denuncia: 'Denuncia',
  resolucion: 'Resolución',
  comparecencia: 'Comparecencia',
  'medida cautelar': 'Medida Cautelar',
  otro: 'Otro',
};

interface TimelineProps {
  eventos: EventoTemporal[];
  casos?: Caso[];
  selectedCasoId?: string;
  onCasoFilter?: (casoId: string | undefined) => void;
}

export default function Timeline({ eventos, casos, selectedCasoId, onCasoFilter }: TimelineProps) {
  const sortedEventos = [...eventos].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const getCasoTitle = (casoId: string): string => {
    if (!casos) return `Caso ${casoId}`;
    const caso = casos.find((c) => c.id === casoId);
    return caso ? caso.titulo : `Caso ${casoId}`;
  };

  return (
    <div className="space-y-6">
      {casos && casos.length > 0 && onCasoFilter && (
        <div className="flex flex-wrap gap-2 border-b-2 border-[#1c1917] pb-3 dark:border-[#3f3f46]" role="group" aria-label="Filtrar por caso">
          <button
            onClick={() => onCasoFilter(undefined)}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
              !selectedCasoId
                ? 'border-[#1c1917] bg-[#1c1917] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] shadow-retro-sm dark:shadow-none'
                : 'border-[#1c1917] bg-[#faf8f2] text-[#1c1917] hover:bg-[#ede9df] dark:border-[#3f3f46] dark:bg-[#1a1c22] dark:text-[#f4f4f5]'
            }`}
          >
            [ TODOS LOS CASOS ]
          </button>
          {casos.map((caso) => (
            <button
              key={caso.id}
              onClick={() => onCasoFilter(caso.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
                selectedCasoId === caso.id
                  ? 'border-[#1c1917] bg-[#1c1917] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] shadow-retro-sm dark:shadow-none'
                  : 'border-[#1c1917] bg-[#faf8f2] text-[#1c1917] hover:bg-[#ede9df] dark:border-[#3f3f46] dark:bg-[#1a1c22] dark:text-[#f4f4f5]'
              }`}
            >
              {caso.titulo.length > 30 ? caso.titulo.substring(0, 30) + '...' : caso.titulo}
            </button>
          ))}
        </div>
      )}

      {sortedEventos.length === 0 ? (
        <div className="text-center py-12 text-[#78716c] dark:text-[#a1a1aa] font-mono text-sm">
          <p>[ No hay registros de eventos en la cronología ]</p>
        </div>
      ) : (
        <ol className="relative" aria-label="Línea temporal de eventos">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#1c1917] dark:bg-[#3f3f46]" aria-hidden="true" />

          <div className="space-y-6">
            {sortedEventos.map((evento) => {
              const colors = tipoColores[evento.tipo] || tipoColores.otro;
              return (
                <li key={evento.id} className="relative pl-10">
                  <div
                    className={`absolute left-2.5 top-2 w-3.5 h-3.5 border-2 border-[#1c1917] dark:border-[#f4f4f5] ${colors.dot}`}
                    aria-hidden="true"
                  />

                  <article className={`${colors.bg} ${colors.border} border-2 p-3.5 shadow-retro-sm dark:shadow-none`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${colors.bg} ${colors.text} border ${colors.border}`}
                          >
                            {tipoLabels[evento.tipo] || evento.tipo}
                          </span>
                          <time
                            dateTime={new Date(evento.fecha).toISOString()}
                            className="text-xs font-mono font-semibold text-[#78716c] dark:text-[#a1a1aa]"
                          >
                            {new Date(evento.fecha).toLocaleDateString('es-HN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        <h4 className="font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5]">
                          {evento.titulo}
                        </h4>
                        {evento.descripcion && (
                          <p className="text-xs text-[#57534e] dark:text-[#a1a1aa] mt-1 leading-relaxed">
                            {evento.descripcion}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa] shrink-0 border border-[#1c1917]/20 dark:border-[#3f3f46] px-1.5 py-0.5 bg-white dark:bg-[#1f2026]">
                        {getCasoTitle(evento.caso_id)}
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </div>
        </ol>
      )}
    </div>
  );
}
