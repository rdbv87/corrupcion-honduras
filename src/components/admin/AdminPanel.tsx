import { useCallback, useEffect, useState } from 'react';
import { ActorRed, CasoRed, ConexionRed } from '@/types/corruption';
import CasoForm from './CasoForm';
import ActorForm from './ActorForm';
import ConexionForm from './ConexionForm';
import {
  getCasosRed,
  getActoresByCaso,
  getConexionesByCaso,
  createCasoRed,
  updateCasoRed,
  deleteCasoRed,
  createActorRed,
  updateActorRed,
  deleteActorRed,
  createConexionRed,
  updateConexionRed,
  deleteConexionRed,
} from '@/lib/db/redesStore';

export default function AdminPanel() {
  const [casos, setCasos] = useState<CasoRed[]>([]);
  const [selectedCaso, setSelectedCaso] = useState<CasoRed | null>(null);
  const [actores, setActores] = useState<ActorRed[]>([]);
  const [conexiones, setConexiones] = useState<ConexionRed[]>([]);
  const [showCasoForm, setShowCasoForm] = useState(false);
  const [editingCaso, setEditingCaso] = useState<CasoRed | undefined>(undefined);
  const [editingActor, setEditingActor] = useState<ActorRed | undefined>(undefined);
  const [editingConexion, setEditingConexion] = useState<ConexionRed | undefined>(undefined);
  const [creatingActor, setCreatingActor] = useState(false);
  const [creatingConexion, setCreatingConexion] = useState(false);

  const refreshCasos = useCallback(() => {
    setCasos(getCasosRed());
  }, []);

  const refreshRed = useCallback((casoId: string) => {
    setActores(getActoresByCaso(casoId));
    setConexiones(getConexionesByCaso(casoId));
  }, []);

  useEffect(() => {
    refreshCasos();
  }, [refreshCasos]);

  useEffect(() => {
    if (selectedCaso) {
      refreshRed(selectedCaso.id);
      setEditingCaso(undefined);
      setEditingActor(undefined);
      setEditingConexion(undefined);
      setCreatingActor(false);
      setCreatingConexion(false);
    }
  }, [selectedCaso, refreshRed]);

  const selectCaso = (caso: CasoRed) => {
    setSelectedCaso(caso);
    setShowCasoForm(false);
  };

  const saveCaso = (data: Partial<CasoRed>) => {
    if (editingCaso) {
      const updated = updateCasoRed(editingCaso.id, data);
      if (updated) {
        refreshCasos();
        setSelectedCaso(updated);
      }
    } else {
      const created = createCasoRed(data as Omit<CasoRed, 'id'>);
      if (created) {
        refreshCasos();
        setSelectedCaso(created);
      }
    }
    setShowCasoForm(false);
    setEditingCaso(undefined);
  };

  const deleteCaso = (caso: CasoRed) => {
    if (!confirm(`¿Eliminar el expediente "${caso.titulo}" con todos sus actores y conexiones?`)) return;
    const ok = deleteCasoRed(caso.id);
    if (ok) {
      setSelectedCaso(null);
      refreshCasos();
    }
  };

  const saveActor = (data: Partial<ActorRed>) => {
    if (editingActor) {
      const updated = updateActorRed(editingActor.id, data);
      if (updated && selectedCaso) refreshRed(selectedCaso.id);
    } else if (selectedCaso) {
      const created = createActorRed(data as Omit<ActorRed, 'id'>);
      if (created) refreshRed(selectedCaso.id);
    }
    setEditingActor(undefined);
    setCreatingActor(false);
  };

  const deleteActor = (actor: ActorRed) => {
    if (!confirm(`¿Eliminar al actor "${actor.nombre}" y sus conexiones?`)) return;
    const ok = deleteActorRed(actor.id);
    if (ok && selectedCaso) refreshRed(selectedCaso.id);
  };

  const saveConexion = (data: Partial<ConexionRed>) => {
    if (editingConexion) {
      const updated = updateConexionRed(editingConexion.id, data);
      if (updated && selectedCaso) refreshRed(selectedCaso.id);
    } else if (selectedCaso) {
      const created = createConexionRed(data as Omit<ConexionRed, 'id'>);
      if (created) refreshRed(selectedCaso.id);
    }
    setEditingConexion(undefined);
    setCreatingConexion(false);
  };

  const deleteConexion = (conexion: ConexionRed) => {
    if (!confirm('¿Eliminar esta conexión?')) return;
    const ok = deleteConexionRed(conexion.id);
    if (ok && selectedCaso) refreshRed(selectedCaso.id);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Lista de casos */}
      <aside className="lg:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
            [ EXPEDIENTES ]
          </h2>
          <button onClick={() => { setEditingCaso(undefined); setShowCasoForm(true); }} className="btn-secondary !px-2 !py-1 text-xs">
            + Nuevo
          </button>
        </div>
        <div className="space-y-2">
          {casos.map((caso) => (
            <div key={caso.id} className={`p-3 card cursor-pointer transition-all ${selectedCaso?.id === caso.id ? 'border-[#b91c1c]' : ''}`} onClick={() => selectCaso(caso)}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">[ {caso.id.toUpperCase()} ]</span>
                  <h3 className="font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5] leading-snug">{caso.titulo}</h3>
                  <span className="text-xs font-mono text-[#b91c1c] dark:text-[#fca5a5]">${(caso.monto_usd / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Detalle del caso seleccionado */}
      <section className="lg:col-span-9">
        {!selectedCaso && !showCasoForm && (
          <div className="card p-8 text-center font-mono text-xs text-[#78716c] dark:text-[#a1a1aa]">
            [ Selecciona un expediente o crea uno nuevo para administrar su red ]
          </div>
        )}

        {showCasoForm && (
          <CasoForm
            initial={editingCaso}
            onSave={saveCaso}
            onCancel={() => { setShowCasoForm(false); setEditingCaso(undefined); }}
          />
        )}

        {selectedCaso && !showCasoForm && (
          <div className="space-y-6">
            {/* Datos del caso */}
            <div className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
                    [ {selectedCaso.id.toUpperCase()} · {selectedCaso.periodo} ]
                  </span>
                  <h3 className="text-lg font-black uppercase text-[#1c1917] dark:text-[#f4f4f5]">{selectedCaso.titulo}</h3>
                  <p className="text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">{selectedCaso.subtitulo}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditingCaso(selectedCaso); setShowCasoForm(true); }} className="btn-secondary !px-3 !py-1.5 text-xs">Editar</button>
                  <button onClick={() => deleteCaso(selectedCaso)} className="btn-secondary !px-3 !py-1.5 text-xs !text-[#b91c1c]">Eliminar</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 border-t border-dashed border-[#1c1917]/20 pt-3 dark:border-[#3f3f46]">
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa]">Monto (HNL)</span>
                  <span className="text-base font-mono font-black text-[#b91c1c] dark:text-[#f87171]">{selectedCaso.monto.toLocaleString('es-HN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa]">Monto (USD)</span>
                  <span className="text-base font-mono font-black text-[#b91c1c] dark:text-[#f87171]">${selectedCaso.monto_usd.toLocaleString('es-HN')}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#78716c] dark:text-[#a1a1aa]">Estado judicial</span>
                  <span className="text-sm font-mono text-[#1c1917] dark:text-[#f4f4f5]">{selectedCaso.status_judicial}</span>
                </div>
              </div>
              <p className="text-xs text-[#44403c] dark:text-[#d4d4d8] mt-3 leading-relaxed">{selectedCaso.descripcion_corta}</p>
              {selectedCaso.fuente_url && (
                <a href={selectedCaso.fuente_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-[#1d4ed8] dark:text-[#93c5fd] underline">
                  {selectedCaso.fuente_principal || 'Fuente'}
                </a>
              )}
            </div>

            {/* Formulario de conexión (si se está editando/creando) */}
            {(editingConexion || creatingConexion) && (
              <ConexionForm
                casoId={selectedCaso.id}
                actores={actores}
                initial={editingConexion}
                onSave={saveConexion}
                onCancel={() => { setEditingConexion(undefined); setCreatingConexion(false); }}
              />
            )}

            {/* Formulario de actor (si se está editando/creando) */}
            {(editingActor || creatingActor) && (
              <ActorForm
                casoId={selectedCaso.id}
                initial={editingActor}
                onSave={saveActor}
                onCancel={() => { setEditingActor(undefined); setCreatingActor(false); }}
              />
            )}

            {/* Actores */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c1917] dark:text-[#f4f4f5]">
                  Actores ({actores.length})
                </h4>
                <button onClick={() => { setEditingConexion(undefined); setEditingActor(undefined); setCreatingActor(true); }} className="btn-secondary !px-3 !py-1 text-xs">+ Actor</button>
              </div>
              <div className="divide-y divide-dashed divide-[#1c1917]/20 dark:divide-[#3f3f46]">
                {actores.map((actor) => (
                  <div key={actor.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#1c1917] dark:text-[#f4f4f5]">{actor.nombre}</span>
                        <span className="badge-gray text-[10px]">{actor.tipo_actor}</span>
                        <span className="badge text-[10px]">{actor.status_legal}</span>
                      </div>
                      {actor.organizacion && <p className="text-[11px] font-mono text-[#78716c] dark:text-[#a1a1aa]">{actor.organizacion}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setCreatingActor(false); setEditingActor(actor); }} className="btn-secondary !px-2 !py-0.5 text-[10px]">Editar</button>
                      <button onClick={() => deleteActor(actor)} className="btn-secondary !px-2 !py-0.5 text-[10px] !text-[#b91c1c]">Eliminar</button>
                    </div>
                  </div>
                ))}
                {actores.length === 0 && (
                  <p className="py-2 text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">[ Sin actores registrados ]</p>
                )}
              </div>
            </div>

            {/* Conexiones */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1c1917] dark:text-[#f4f4f5]">
                  Conexiones ({conexiones.length})
                </h4>
                {actores.length >= 2 && (
                  <button onClick={() => { setEditingActor(undefined); setEditingConexion(undefined); setCreatingConexion(true); }} className="btn-secondary !px-3 !py-1 text-xs">+ Conexión</button>
                )}
              </div>
              <div className="divide-y divide-dashed divide-[#1c1917]/20 dark:divide-[#3f3f46]">
                {conexiones.map((c) => {
                  const nombre = (id: string) => actores.find((a) => a.id === id)?.nombre ?? id;
                  return (
                    <div key={c.id} className="py-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 flex-wrap text-sm">
                          <span className="font-semibold text-[#1c1917] dark:text-[#f4f4f5]">{nombre(c.actor_origen_id)}</span>
                          <span className="text-[#78716c]">→</span>
                          <span className="font-semibold text-[#1c1917] dark:text-[#f4f4f5]">{nombre(c.actor_destino_id)}</span>
                          <span className="badge text-[10px]">{c.tipo}</span>
                        </div>
                        <p className="text-[11px] text-[#78716c] dark:text-[#a1a1aa]">{c.descripcion}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => { setCreatingConexion(false); setEditingConexion(c); }} className="btn-secondary !px-2 !py-0.5 text-[10px]">Editar</button>
                        <button onClick={() => deleteConexion(c)} className="btn-secondary !px-2 !py-0.5 text-[10px] !text-[#b91c1c]">Eliminar</button>
                      </div>
                    </div>
                  );
                })}
                {conexiones.length === 0 && (
                  <p className="py-2 text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">[ Sin conexiones registradas ]</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
