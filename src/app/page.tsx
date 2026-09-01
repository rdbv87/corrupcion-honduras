'use client';

import { useState, useEffect, useCallback } from 'react';
import CytoscapeGraph from '@/components/graph/CytoscapeGraph';
import { SearchBar, Filters, FilterState, DataTable, DataTableColumn } from '@/components/search';
import { buildGraphData } from '@/components/graph/graphUtils';
import { layoutOptions, layoutDescriptions, LayoutName } from '@/components/graph/graphLayouts';
import {
  GraphNode, GraphEdge, Caso, Entidad, EventoTemporal,
  KPIIndicator, CasoRed,
} from '@/types/corruption';
import { Timeline } from '@/components/timeline';

interface SearchResult {
  type: string;
  id: string;
  titulo: string;
  descripcion?: string;
  relevance: number;
}

type MainTab = 'search' | 'casos' | 'entidades' | 'timeline';

const casoColumns: DataTableColumn<Caso>[] = [
  { key: 'titulo', label: 'Título' },
  {
    key: 'status',
    label: 'Estado',
    render: (item) => (
      <span
        className={`badge ${
          item.status === 'abierto'
            ? 'badge-green'
            : item.status === 'investigacion'
              ? 'badge-yellow'
              : item.status === 'cerrado'
                ? 'badge-gray'
                : 'badge-red'
        }`}
      >
        {item.status}
      </span>
    ),
  },
  {
    key: 'monto_estimado',
    label: 'Monto',
    render: (item) =>
      item.monto_estimado
        ? `L. ${item.monto_estimado.toLocaleString()}`
        : '-',
  },
  {
    key: 'fecha_inicio',
    label: 'Fecha Inicio',
    render: (item) => new Date(item.fecha_inicio).toLocaleDateString('es-HN'),
  },
];

const entidadColumns: DataTableColumn<Entidad>[] = [
  { key: 'nombre', label: 'Nombre' },
  {
    key: 'tipo',
    label: 'Tipo',
    render: (item) => (
      <span className="capitalize">{item.tipo}</span>
    ),
  },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'pais', label: 'País' },
];

export default function Home() {
  const [currentLayout, setCurrentLayout] = useState<LayoutName>('cose');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredCasos, setFilteredCasos] = useState<Caso[]>([]);
  const [filteredEntidades, setFilteredEntidades] = useState<Entidad[]>([]);
  const [activeTab, setActiveTab] = useState<MainTab>('search');
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<EventoTemporal[]>([]);
  const [selectedCasoId, setSelectedCasoId] = useState<string | undefined>();

  // KPI state
  const [kpiIndicators, setKpiIndicators] = useState<KPIIndicator[]>([]);
  const [redesCasos, setRedesCasos] = useState<CasoRed[]>([]);

  // Data fetching
  const fetchCasos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.status) params.set('status', filters.status);
      if (filters.monto_min) params.set('monto_min', filters.monto_min);
      if (filters.monto_max) params.set('monto_max', filters.monto_max);
      if (filters.fecha_desde) params.set('fecha_desde', filters.fecha_desde);
      if (filters.fecha_hasta) params.set('fecha_hasta', filters.fecha_hasta);
      const res = await fetch(`/api/casos?${params.toString()}`);
      const data = await res.json();
      setFilteredCasos(data);
    } catch { /* ignore */ }
  }, [searchQuery, filters]);

  const fetchEntidades = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.tipo) params.set('tipo', filters.tipo);
      const res = await fetch(`/api/entidades?${params.toString()}`);
      const data = await res.json();
      setFilteredEntidades(data);
    } catch { /* ignore */ }
  }, [searchQuery, filters.tipo]);

  const fetchSearch = useCallback(async () => {
    if (!searchQuery && !filters.status && !filters.tipo) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.status) params.set('status', filters.status);
      if (filters.tipo) params.set('tipo', filters.tipo);
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters.status, filters.tipo]);

  const fetchEventos = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCasoId) params.set('caso_id', selectedCasoId);
      const res = await fetch(`/api/eventos?${params.toString()}`);
      const data = await res.json();
      setEventos(data);
    } catch { /* ignore */ }
  }, [selectedCasoId]);

  const fetchKPIData = useCallback(async () => {
    try {
      const indRes = await fetch('/api/kpi/indicators');
      setKpiIndicators(await indRes.json());
    } catch { /* ignore */ }
  }, []);

  const fetchRedesCasos = useCallback(async () => {
    try {
      const res = await fetch('/api/redes/casos');
      setRedesCasos(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchEventos(); }, [fetchEventos]);
  useEffect(() => { fetchSearch(); fetchCasos(); fetchEntidades(); }, [fetchSearch, fetchCasos, fetchEntidades]);
  useEffect(() => { fetchKPIData(); }, [fetchKPIData]);
  useEffect(() => { fetchRedesCasos(); }, [fetchRedesCasos]);

  const handleNodeClick = (node: GraphNode) => { setSelectedNode(node); setSelectedEdge(null); };
  const handleEdgeClick = (edge: GraphEdge) => { setSelectedEdge(edge); setSelectedNode(null); };

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

  const mainTabs: { key: MainTab; label: string; count?: number }[] = [
    { key: 'search', label: 'Búsqueda', count: searchResults.length },
    { key: 'casos', label: 'Casos', count: filteredCasos.length },
    { key: 'entidades', label: 'Entidades', count: filteredEntidades.length },
    { key: 'timeline', label: 'Línea Temporal', count: eventos.length },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-[#f5f3ec] dark:bg-[#121316] transition-colors py-6 sm:py-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171] block mb-1">
            [ ARCHIVO PÚBLICO & DOCUMENTACIÓN ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1c1917] dark:text-[#f4f4f5] sm:text-4xl">
            Exploración de Expedientes
          </h1>
          <p className="mt-2 text-sm font-mono text-[#57534e] dark:text-[#a1a1aa]">
            Registro estructurado de casos de corrupción, actores implicados, perjuicio social y cronología judicial en Honduras.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="card mb-6">
          <div className="border-b-2 border-[#1c1917] dark:border-[#3f3f46] overflow-x-auto bg-[#faf8f2] dark:bg-[#181920]">
            <nav className="flex gap-1 px-4 py-2 min-w-max" role="tablist" aria-label="Tabs principales">
              {mainTabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-1.5 px-3 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-[#1c1917] bg-[#1c1917] text-white dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] shadow-retro-sm dark:shadow-none'
                      : 'border-transparent text-[#78716c] hover:border-[#1c1917] hover:text-[#1c1917] dark:text-[#a1a1aa] dark:hover:border-[#71717a] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1.5 px-1 py-0.2 text-[10px] border border-current">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab: Búsqueda */}
          {activeTab === 'search' && (
            <>
              <div className="p-4 sm:p-6 border-b-2 border-[#1c1917] dark:border-[#3f3f46] bg-[#faf8f2] dark:bg-[#1f2026]">
                <div className="flex flex-col gap-4">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  <Filters filters={filters} onChange={setFilters} />
                </div>
              </div>
              <div className="p-4" role="tabpanel">
                {loading && <p className="text-center font-mono text-xs text-[#78716c] dark:text-[#a1a1aa] py-4">[ BUSCANDO EN EXPEDIENTES... ]</p>}
                {!loading && (
                  <DataTable
                    columns={[
                      { key: 'type', label: 'Tipo', render: (item) => <span className="font-mono uppercase font-bold">{String(item.type)}</span> },
                      { key: 'titulo', label: 'Título' },
                      { key: 'descripcion', label: 'Descripción', render: (item) => <span className="text-[#78716c] dark:text-[#a1a1aa] truncate max-w-xs block">{String(item.descripcion || '-')}</span> },
                      { key: 'relevance', label: 'Relevancia', render: (item) => <span className="font-mono text-[#1d4ed8] dark:text-[#93c5fd] font-bold">{String(item.relevance)}</span> },
                    ]}
                    data={searchResults}
                    emptyMessage="Escribe para buscar en casos, entidades y más"
                  />
                )}
              </div>
            </>
          )}

          {/* Tab: Casos */}
          {activeTab === 'casos' && (
            <div className="p-4" role="tabpanel">
              <DataTable columns={casoColumns} data={filteredCasos} emptyMessage="No se encontraron casos" />
            </div>
          )}

          {/* Tab: Entidades */}
          {activeTab === 'entidades' && (
            <div className="p-4" role="tabpanel">
              <DataTable columns={entidadColumns} data={filteredEntidades} emptyMessage="No se encontraron entidades" />
            </div>
          )}

          {/* Tab: Línea Temporal */}
          {activeTab === 'timeline' && (
            <div className="p-4" role="tabpanel">
              <Timeline eventos={eventos} casos={filteredCasos} selectedCasoId={selectedCasoId} onCasoFilter={setSelectedCasoId} />
            </div>
          )}
        </div>

        {/* Exportación */}
        <div className="card p-4 sm:p-5 mb-6">
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

        {/* Grafo general */}
        <div className="card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b-2 border-[#1c1917] pb-3 dark:border-[#3f3f46]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] block">
                [ VISUALIZACIÓN DE RED ]
              </span>
              <h2 className="text-base font-black uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5]">
                Grafo General de Entidades
              </h2>
            </div>
            <select
              value={currentLayout}
              onChange={(e) => setCurrentLayout(e.target.value as LayoutName)}
              aria-label="Seleccionar layout del grafo"
              className="select-base text-xs w-full sm:w-auto"
            >
              {(Object.keys(layoutOptions) as LayoutName[]).map((layout) => (
                <option key={layout} value={layout}>{layoutDescriptions[layout]}</option>
              ))}
            </select>
          </div>
          <div className="h-[400px] sm:h-[500px] md:h-[600px]">
            <CytoscapeGraph
              data={buildGraphData(filteredCasos.length ? filteredCasos : [], filteredEntidades.length ? filteredEntidades : [], [], [])}
              layout={currentLayout}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              className="h-full"
            />
          </div>
          {(selectedNode || selectedEdge) && (
            <div className="mt-4 p-4 bg-[#faf8f2] dark:bg-[#1f2026] border-2 border-[#1c1917] dark:border-[#3f3f46] text-xs font-mono transition-colors">
              {selectedNode && (
                <div>
                  <h3 className="font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5] uppercase">[ Nodo Seleccionado ]</h3>
                  <p className="text-[#57534e] dark:text-[#a1a1aa] mt-1">
                    <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">Nombre:</span> {selectedNode.label}
                  </p>
                  <p className="text-[#57534e] dark:text-[#a1a1aa]">
                    <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">Tipo:</span> {selectedNode.type}
                  </p>
                  {'descripcion' in selectedNode.data && (
                    <p className="text-[#57534e] dark:text-[#a1a1aa] mt-1">
                      <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">Descripción:</span> {selectedNode.data.descripcion}
                    </p>
                  )}
                </div>
              )}
              {selectedEdge && (
                <div>
                  <h3 className="font-bold text-sm text-[#1c1917] dark:text-[#f4f4f5] uppercase">[ Conexión Seleccionada ]</h3>
                  <p className="text-[#57534e] dark:text-[#a1a1aa] mt-1">
                    <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">Tipo:</span> {selectedEdge.label}
                  </p>
                  <p className="text-[#57534e] dark:text-[#a1a1aa]">
                    <span className="font-bold text-[#1c1917] dark:text-[#f4f4f5]">Fuerza:</span> {(selectedEdge.weight * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Casos Documentados</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredCasos.length || '-'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">activos y archivados</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Redes de Corrupción</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{redesCasos.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">casos emblemáticos mapeados</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Indicadores KPI</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{kpiIndicators.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">en 6 áreas de impacto</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Entidades Mapeadas</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{filteredEntidades.length || '-'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">personas, empresas e instituciones</p>
          </div>
        </div>
      </section>

    </main>
  );
}
