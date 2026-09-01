'use client';

import { useState } from 'react';
import { ActorRed, ConexionRed } from '@/types/corruption';

const tipoConexionOptions: ConexionRed['tipo'][] = ['financiero', 'familiar', 'politico', 'empresarial', 'testaferro'];

interface ConexionFormProps {
  casoId: string;
  actores: ActorRed[];
  initial?: ConexionRed;
  onSave: (data: Partial<ConexionRed>) => void;
  onCancel?: () => void;
}

export default function ConexionForm({ casoId, actores, initial, onSave, onCancel }: ConexionFormProps) {
  const [origenId, setOrigenId] = useState(initial?.actor_origen_id ?? actores[0]?.id ?? '');
  const [destinoId, setDestinoId] = useState(initial?.actor_destino_id ?? actores[1]?.id ?? '');
  const [tipo, setTipo] = useState<ConexionRed['tipo']>(initial?.tipo ?? 'financiero');
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '');
  const [monto, setMonto] = useState(initial?.monto ?? 0);
  const [periodo, setPeriodo] = useState(initial?.periodo ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      caso_id: casoId,
      actor_origen_id: origenId,
      actor_destino_id: destinoId,
      tipo,
      descripcion,
      monto: Number(monto) || undefined,
      periodo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 card p-4">
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c1917] dark:text-[#f4f4f5] border-b-2 border-[#1c1917] pb-1 dark:border-[#3f3f46]">
        [ {initial ? 'EDITAR CONEXIÓN' : 'NUEVA CONEXIÓN'} ]
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Actor origen</label>
          <select className="select-base w-full" value={origenId} onChange={(e) => setOrigenId(e.target.value)}>
            {actores.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Actor destino</label>
          <select className="select-base w-full" value={destinoId} onChange={(e) => setDestinoId(e.target.value)}>
            {actores.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Tipo de relación</label>
        <select className="select-base w-full" value={tipo} onChange={(e) => setTipo(e.target.value as ConexionRed['tipo'])}>
          {tipoConexionOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Descripción *</label>
        <textarea className="input-base" rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Monto (HNL)</label>
          <input className="input-base" type="number" min={0} value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Periodo</label>
          <input className="input-base" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
        </div>
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
