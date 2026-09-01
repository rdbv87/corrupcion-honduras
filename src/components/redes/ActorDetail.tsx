'use client';

import { ActorRed, ConexionRed } from '@/types/corruption';
import { statusColors } from './CasoSelector';

interface ActorDetailProps {
  actor: ActorRed;
  conexiones: ConexionRed[];
  allActores: ActorRed[];
  onClose?: () => void;
}

const tipoLabels: Record<string, string> = {
  funcionario: 'Funcionario',
  empresario: 'Empresario',
  empresa: 'Empresa',
  testaferro: 'Testaferro',
  politico: 'Político',
  proveedor: 'Proveedor',
};

const statusLabels: Record<string, string> = {
  condenado: 'Condenado',
  procesado: 'Procesado',
  pro_fugo: 'Prófugo',
  investigado: 'Investigado',
  absuelto: 'Absuelto',
};

export default function ActorDetail({ actor, conexiones, allActores, onClose }: ActorDetailProps) {
  const actorConexiones = conexiones.filter(
    (c) => c.actor_origen_id === actor.id || c.actor_destino_id === actor.id
  );

  const formatMonto = (monto?: number) => {
    if (!monto) return null;
    if (monto >= 1000000000) return `L.${(monto / 1000000000).toFixed(1)}B`;
    if (monto >= 1000000) return `L.${(monto / 1000000).toFixed(1)}M`;
    return `L.${monto.toLocaleString('es-HN')}`;
  };

  const getActorName = (id: string) => allActores.find((a) => a.id === id)?.nombre ?? id;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-3 border-b-2 border-[#1c1917] pb-2 dark:border-[#3f3f46]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
            [ FICHA DE ACTOR ]
          </span>
          <div className="flex items-center gap-2 mt-0.5 mb-1">
            <h3 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] text-base">{actor.nombre}</h3>
            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${statusColors[actor.status_legal] ?? 'bg-stone-100 text-stone-700 border-stone-400'}`}>
              {statusLabels[actor.status_legal]}
            </span>
          </div>
          <p className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
            {tipoLabels[actor.tipo_actor]}{actor.organizacion ? ` / ${actor.organizacion}` : ''}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 border border-[#1c1917] dark:border-[#71717a] text-[#1c1917] hover:bg-[#1c1917] hover:text-white dark:text-[#f4f4f5] dark:hover:bg-[#f4f4f5] dark:hover:text-[#121316] transition-colors"
            aria-label="Cerrar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-xs text-[#44403c] dark:text-[#d4d4d8] mb-3 leading-relaxed border-l-2 border-[#1c1917] pl-2 dark:border-[#71717a]">
        {actor.rol}
      </p>

      {actor.monto_vinculado && (
        <div className="bg-[#fef2f2] dark:bg-[#7f1d1d]/20 border border-[#b91c1c] p-2.5 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#b91c1c] dark:text-[#fca5a5] block">
            Perjuicio / Monto Vinculado
          </span>
          <span className="block text-lg font-mono font-black text-[#b91c1c] dark:text-[#f87171]">
            {formatMonto(actor.monto_vinculado)}
          </span>
        </div>
      )}

      {actorConexiones.length > 0 && (
        <div>
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5] mb-2 border-b border-dashed border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
            Conexiones Registradas ({actorConexiones.length})
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {actorConexiones.map((c) => {
              const otherId = c.actor_origen_id === actor.id ? c.actor_destino_id : c.actor_origen_id;
              const direction = c.actor_origen_id === actor.id ? '→' : '←';
              return (
                <div key={c.id} className="p-2 border border-[#1c1917]/20 bg-[#faf8f2] dark:border-[#3f3f46] dark:bg-[#1a1c22] text-xs">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-[#1c1917] dark:text-[#f4f4f5]">{direction} {getActorName(otherId)}</span>
                    <span className="text-[10px] font-mono uppercase px-1 border border-[#1c1917]/30 dark:border-[#52525b]">
                      {c.tipo}
                    </span>
                  </div>
                  {c.monto && (
                    <span className="text-xs font-mono font-bold text-[#b91c1c] dark:text-[#fca5a5] block mb-0.5">
                      {formatMonto(c.monto)}
                    </span>
                  )}
                  <p className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">{c.descripcion}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
