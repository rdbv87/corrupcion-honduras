'use client';

import { useState } from 'react';
import CytoscapeGraph from '@/components/graph/CytoscapeGraph';
import { buildGraphData } from '@/components/graph/graphUtils';
import { layoutOptions, layoutDescriptions, LayoutName } from '@/components/graph/graphLayouts';
import { 
  sampleCasos, 
  sampleEntidades, 
  sampleConexiones, 
  sampleCasoEntidad 
} from '@/data/sample';
import { GraphNode, GraphEdge } from '@/types/corruption';

const graphData = buildGraphData(
  sampleCasos,
  sampleEntidades,
  sampleConexiones,
  sampleCasoEntidad
);

export default function Home() {
  const [currentLayout, setCurrentLayout] = useState<LayoutName>('cose');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Corrupción Honduras
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Mapeamos, documentamos y visibilizamos el daño social de la
            corrupción en Honduras.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Red de Corrupción
            </h2>
            <div className="flex gap-2">
              <select
                value={currentLayout}
                onChange={(e) => setCurrentLayout(e.target.value as LayoutName)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(Object.keys(layoutOptions) as LayoutName[]).map((layout) => (
                  <option key={layout} value={layout}>
                    {layoutDescriptions[layout]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-[600px]">
            <CytoscapeGraph
              data={graphData}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              className="h-full"
            />
          </div>

          {(selectedNode || selectedEdge) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              {selectedNode && (
                <div>
                  <h3 className="font-semibold text-gray-800">Nodo seleccionado</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Nombre:</span> {selectedNode.label}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Tipo:</span> {selectedNode.type}
                  </p>
                  {'descripcion' in selectedNode.data && (
                    <p className="text-gray-600">
                      <span className="font-medium">Descripción:</span>{' '}
                      {selectedNode.data.descripcion}
                    </p>
                  )}
                </div>
              )}
              {selectedEdge && (
                <div>
                  <h3 className="font-semibold text-gray-800">Conexión seleccionada</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Tipo:</span> {selectedEdge.label}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Fuerza:</span>{' '}
                    {(selectedEdge.weight * 100).toFixed(0)}%
                  </p>
                  {'descripcion' in selectedEdge.data && (
                    <p className="text-gray-600">
                      <span className="font-medium">Descripción:</span>{' '}
                      {selectedEdge.data.descripcion}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Casos Documentados
            </h3>
            <p className="text-3xl font-bold text-blue-600">{sampleCasos.length}</p>
            <p className="text-sm text-gray-500 mt-1">activos y archivados</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Entidades Mapeadas
            </h3>
            <p className="text-3xl font-bold text-green-600">{sampleEntidades.length}</p>
            <p className="text-sm text-gray-500 mt-1">personas, empresas e instituciones</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Conexiones Identificadas
            </h3>
            <p className="text-3xl font-bold text-purple-600">{sampleConexiones.length}</p>
            <p className="text-sm text-gray-500 mt-1">relaciones de corrupción</p>
          </div>
        </div>
      </section>
    </main>
  );
}
