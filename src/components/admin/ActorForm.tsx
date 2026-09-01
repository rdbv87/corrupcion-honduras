'use client';

import { useState } from 'react';
import { ActorRed } from '@/types/corruption';

const tipoActorOptions: ActorRed['tipo_actor'][] = ['funcionario', 'empresario', 'empresa', 'testaferro', 'politico', 'proveedor'];
const statusLegalOptions: ActorRed['status_legal'][] = ['condenado', 'procesado', 'pro_fugo', 'investigado', 'absuelto'];

interface ActorFormProps {
  casoId: string;
  initial?: ActorRed;
  onSave: (data: Partial<ActorRed>) => void;
  onCancel?: () => void;
}

export default function ActorForm({ casoId, initial, onSave, onCancel }: ActorFormProps) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [tipoActor, setTipoActor] = useState<ActorRed['tipo_actor']>(initial?.tipo_actor ?? 'funcionario');
  const [statusLegal, setStatusLegal] = useState<ActorRed['status_legal']>(initial?.status_legal ?? 'investigado');
  const [rol, setRol] = useState(initial?.rol ?? '');
  const [organizacion, setOrganizacion] = useState(initial?.organizacion ?? '');
  const [monto, setMonto] = useState(initial?.monto_vinculado ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      caso_id: casoId,
      nombre,
      tipo_actor: tipoActor,
      status_legal: statusLegal,
      rol,
      organizacion: organizacion || undefined,
      monto_vinculado: Number(monto) || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 card p-4">
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c1917] dark:text-[#f4f4f5] border-b-2 border-[#1c1917] pb-1 dark:border-[#3f3f46]">
        [ {initial ? 'EDITAR ACTOR' : 'NUEVO ACTOR'} ]
      </h3>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Nombre *</label>
        <input className="input-base" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Tipo de actor</label>
          <select className="select-base w-full" value={tipoActor} onChange={(e) => setTipoActor(e.target.value as ActorRed['tipo_actor'])}>
            {tipoActorOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Estado procesal</label>
          <select className="select-base w-full" value={statusLegal} onChange={(e) => setStatusLegal(e.target.value as ActorRed['status_legal'])}>
            {statusLegalOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Rol</label>
        <textarea className="input-base" rows={2} value={rol} onChange={(e) => setRol(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Organización</label>
        <input className="input-base" value={organizacion} onChange={(e) => setOrganizacion(e.target.value)} />
      </div>
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-1">Monto vinculado (HNL)</label>
        <input className="input-base" type="number" min={0} value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
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
