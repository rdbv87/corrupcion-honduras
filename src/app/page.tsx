'use client';

import { useEffect, useState } from 'react';
import { ActorDetail, CasoSelector, RedCorrupcion } from '@/components/redes';
import { ActorRed, CasoRed, ConexionRed, RedGraphData } from '@/types/corruption';
import { allCasosRed, allActoresRed, getActoresByCaso, getConexionesByCaso } from '@/data/redes';
import { kpiIndicators } from '@/data/kpi';
import { KPIIndicator } from '@/types/corruption';

const actorColorsMap: Record<string, string> = {
  funcionario: '#ef4444',
  empresario: '#f59e0b',
  empresa: '#8b5cf6',
  testaferro: '#6b7280',
  politico: '#3b82f6',
  proveedor: '#10b981',
};

function formatUsdM(monto: number): string {
  if (monto >= 1000000000) return `${(monto / 1000000000).toFixed(2)}B`;
  if (monto >= 1000000) return `${(monto / 1000000).toFixed(1)}M`;
  return monto.toLocaleString('es-HN');
}

export default function Home() {
  const [casos, setCasos] = useState<CasoRed[]>([]);
  const [selectedCaso, setSelectedCaso] = useState<CasoRed | null>(null);
  const [graphData, setGraphData] = useState<RedGraphData | null>(null);
  const [actores, setActores] = useState<ActorRed[]>([]);
  const [conexiones, setConexiones] = useState<ConexionRed[]>([]);
  const [selectedActor, setSelectedActor] = useState<ActorRed | null>(null);
  const [kpiIndicatorsList, setKpiIndicatorsList] = useState<KPIIndicator[]>([]);

  useEffect(() => {
    setCasos(allCasosRed);
    setKpiIndicatorsList(kpiIndicators);
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
    setActores(currentActores);
    setConexiones(currentConexiones);
    setSelectedActor(null);
  }, [selectedCaso]);

  const handleActorClick = (actor: { id: string }) => {
    setSelectedActor(actores.find((item) => item.id === actor.id) ?? null);
  };

  const handleExport = async (format: 'csv' | 'json', tipo: string) => {
    const res = await fetch(`/api/export?format=${format}&tipo=${tipo}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corrupcion_hn_${tipo}.${format === 'csv' ? 'csv' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalUsdDesviado = allCasosRed.reduce((acc, c) => acc + c.monto_usd, 0);
  const allActoresCount = allActoresRed.length;

  return (
    <main id="main-content" className="min-h-screen bg-[#f5f3ec] dark:bg-[#121316] transition-colors py-6 sm:py-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Encabezado editorial */}
        <div className="mb-8 max-w-3xl border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171] block mb-1">
            [ ARCHIVO PÚBLICO & DOCUMENTACIÓN ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1c1917] dark:text-[#f4f4f5] sm:text-4xl">
            Exploración de Expedientes
          </h1>
          <p className="mt-2 text-sm font-mono text-[#57534e] dark:text-[#a1a1aa]">
            Registro estructurado de casos emblemáticos de corrupción en Honduras, con actores implicados,
            perjuicio económico y estado judicial, con base en investigaciones del CNA, el Ministerio Público
            y expedientes públicos.
          </p>
        </div>

        {/* Estadísticas reales */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-2 border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
              [ Casos Emblemáticos ]
            </h3>
            <p className="text-3xl font-black text-[#1c1917] dark:text-[#f4f4f5]">{allCasosRed.length}</p>
            <p className="text-xs font-mono text-[#57534e] dark:text-[#a1a1aa] mt-1">redes de corrupción mapeadas</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-2 border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
              [ Perjuicio Documentado ]
            </h3>
            <p className="text-3xl font-black text-[#b91c1c] dark:text-[#f87171]">
              US${formatUsdM(totalUsdDesviado)}
            </p>
            <p className="text-xs font-mono text-[#57534e] dark:text-[#a1a1aa] mt-1">desviados entre los 5 casos</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-2 border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
              [ Actores Mapeados ]
            </h3>
            <p className="text-3xl font-black text-[#1d4ed8] dark:text-[#93c5fd]">{allActoresCount}</p>
            <p className="text-xs font-mono text-[#57534e] dark:text-[#a1a1aa] mt-1">funcionarios, empresas y testaferros</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#78716c] dark:text-[#a1a1aa] mb-2 border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
              [ Indicadores KPI ]
            </h3>
            <p className="text-3xl font-black text-[#15803d] dark:text-[#86efac]">{kpiIndicatorsList.length}</p>
            <p className="text-xs font-mono text-[#57534e] dark:text-[#a1a1aa] mt-1">en 6 áreas de impacto</p>
          </div>
        </div>

        {/* Visualización de red real */}
        <div className="card p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b-2 border-[#1c1917] pb-3 dark:border-[#3f3f46]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
                [ VISUALIZACIÓN DE RED ]
              </span>
              <h2 className="text-base font-black uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5]">
                Grafo de Redes de Corrupción
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171]">
              {selectedCaso ? `EXPEDIENTE #${selectedCaso.id.toUpperCase()}` : 'SELECCIONA UN CASO'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <h3 className="mb-3 text-xs font-mono font-bold uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] border-b border-[#1c1917]/20 pb-1 dark:border-[#3f3f46]">
                [ SELECCIÓN DE CASO ]
              </h3>
              <CasoSelector casos={casos} selectedId={selectedCaso?.id} onSelect={setSelectedCaso} />
            </aside>

            <section className="lg:col-span-5" aria-label="Grafo de relaciones">
              {graphData ? (
                <RedCorrupcion
                  graphData={graphData}
                  actorColors={actorColorsMap}
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
        </div>

        {/* Exportación */}
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
                [ DESCARGA CÍVICA ]
              </span>
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5]">
                Exportar Datos Abiertos
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleExport('csv', 'casos')} className="btn-secondary text-xs">CSV Casos</button>
              <button onClick={() => handleExport('csv', 'entidades')} className="btn-secondary text-xs">CSV Entidades</button>
              <button onClick={() => handleExport('json', 'all')} className="btn-primary text-xs">JSON Completo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
