'use client';

import { useState } from 'react';
import { CasoRed } from '@/types/corruption';

interface CasoFormProps {
  initial?: CasoRed;
  onSave: (data: Partial<CasoRed>) => void;
  onCancel?: () => void;
}

export default function CasoForm({ initial, onSave, onCancel }: CasoFormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [subtitulo, setSubtitulo] = useState(initial?.subtitulo ?? '');
  const [periodo, setPeriodo] = useState(initial?.periodo ?? '');
  const [monto, setMonto] = useState(initial?.monto ?? 0);
  const [montoUsd, setMontoUsd] = useState(initial?.monto_usd ?? 0);
  const [descripcionCorta, setDescripcionCorta] = useState(initial?.descripcion_corta ?? '');
  const [fuentePrincipal, setFuentePrincipal] = useState(initial?.fuente_principal ?? '');
  const [fuenteUrl, setFuenteUrl] = useState(initial?.fuente_url ?? '');
  const [statusJudicial, setStatusJudicial] = useState(initial?.status_judicial ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      titulo,
      subtitulo,
      periodo,
      monto: Number(monto) || 0,
      moneda: 'HNL',
      monto_usd: Number(montoUsd) || 0,
      descripcion_corta: descripcionCorta,
      fuente_principal: fuentePrincipal,
      fuente_url: fuenteUrl,
      status_judicial: statusJudicial,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 card p-4">
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c1917] dark:text-[#f4f4f5] border-b-2 border-[#1c1917] pb-1 dark:border-[#3f3f46]">
        [ {initial ? 'EDITAR EXPEDIENTE' : 'NUEVO EXPEDIENTE'} ]
      </h3>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Título *</label>
        <input className="input-base" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Subtítulo</label>
        <input className="input-base" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Periodo</label>
        <input className="input-base" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Monto (HNL)</label>
          <input className="input-base" type="number" min={0} value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Monto (USD)</label>
          <input className="input-base" type="number" min={0} value={montoUsd} onChange={(e) => setMontoUsd(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Estado judicial</label>
        <input className="input-base" value={statusJudicial} onChange={(e) => setStatusJudicial(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Descripción corta</label>
        <textarea className="input-base" rows={3} value={descripcionCorta} onChange={(e) => setDescripcionCorta(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Fuente principal</label>
        <input className="input-base" value={fuentePrincipal} onChange={(e) => setFuentePrincipal(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">URL de la fuente</label>
        <input className="input-base" type="url" value={fuenteUrl} onChange={(e) => setFuenteUrl(e.target.value)} />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">Guardar</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        )}
      </div>
    </form>
  );
}
