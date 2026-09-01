'use client';

import { useEffect, useState } from 'react';
import { ActorDetail, CasoSelector, RedCorrupcion } from '@/components/redes';
import { ActorRed, CasoRed, ConexionRed, RedGraphData } from '@/types/corruption';
import { allCasosRed, getActoresByCaso, getConexionesByCaso } from '@/data/redes';

const actorColorsMap: Record<string, string> = {
  funcionario: '#ef4444',
  empresario: '#f59e0b',
  empresa: '#8b5cf6',
  testaferro: '#6b7280',
  politico: '#3b82f6',
  proveedor: '#10b981',
};

export default function RedesPage() {
  const [casos, setCasos] = useState<CasoRed[]>([]);
  const [selectedCaso, setSelectedCaso] = useState<CasoRed | null>(null);
  const [graphData, setGraphData] = useState<RedGraphData | null>(null);
  const [actorColors, setActorColors] = useState<Record<string, string>>({});
  const [actores, setActores] = useState<ActorRed[]>([]);
  const [conexiones, setConexiones] = useState<ConexionRed[]>([]);
  const [selectedActor, setSelectedActor] = useState<ActorRed | null>(null);

  useEffect(() => {
    setCasos(allCasosRed);
  }, []);

  useEffect(() => {
    if (!selectedCaso) return;

    const currentActores = getActoresByCaso(selectedCaso.id);
    const currentConexiones = getConexionesByCaso(selectedCaso.id);

    const graph: RedGraphData = {
      nodes: currentActores.map((actor) => ({
        id: actor.id,
        label: actor.nombre,
        tipo: actor.tipo_actor,
        status: actor.status_legal,
        labelShort: actor.nombre.length > 20 ? actor.nombre.substring(0, 20) + '...' : actor.nombre,
      })),
      edges: currentConexiones.map((conn) => ({
        id: conn.id,
        source: conn.actor_origen_id,
        target: conn.actor_destino_id,
        label: conn.descripcion.substring(0, 40) + (conn.descripcion.length > 40 ? '...' : ''),
        tipo: conn.tipo,
        weight: conn.monto ? Math.min(1, conn.monto / 100000000) : 0.3,
      })),
    };

    setGraphData(graph);
    setActorColors(actorColorsMap);
    setActores(currentActores);
    setConexiones(currentConexiones);
    setSelectedActor(null);
  }, [selectedCaso]);

  const handleActorClick = (actor: { id: string }) => {
    setSelectedActor(actores.find((item) => item.id === actor.id) ?? null);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f5f3ec] dark:bg-[#121316] transition-colors py-8 sm:py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171] block mb-1">
            [ CASOS EMBLEMÁTICOS & EXPEDIENTES ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1c1917] dark:text-[#f4f4f5] sm:text-4xl">
            Redes de Corrupción
          </h1>
          <p className="mt-2 text-sm font-mono text-[#57534e] dark:text-[#a1a1aa]">
            Mapeo de actores clave, empresas fantasma, intermediarios y flujos financieros documentados por investigaciones del CNA y requerimientos del Ministerio Público.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="mb-3 text-xs font-mono font-bold uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
              [ SELECCIÓN DE CASO ]
            </h2>
            <CasoSelector casos={casos} selectedId={selectedCaso?.id} onSelect={setSelectedCaso} />
          </aside>

          <section className="lg:col-span-5" aria-label="Grafo de relaciones">
            {graphData ? (
              <RedCorrupcion
                graphData={graphData}
                actorColors={actorColors}
                onActorClick={handleActorClick}
                className="h-[450px] sm:h-[560px]"
              />
            ) : (
              <div className="card flex h-[450px] items-center justify-center p-8 text-center font-mono text-xs text-[#78716c] dark:text-[#a1a1aa] sm:h-[560px]">
                [ Selecciona un caso para visualizar su red de actores y desvíos ]
              </div>
            )}
          </section>

          <aside className="lg:col-span-3">
            {selectedActor ? (
              <ActorDetail
                actor={selectedActor}
                conexiones={conexiones}
                allActores={actores}
                onClose={() => setSelectedActor(null)}
              />
            ) : (
              <div className="card p-4 text-xs font-mono text-[#78716c] dark:text-[#a1a1aa]">
                [ Selecciona un nodo en el grafo para abrir su ficha de investigación ]
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}