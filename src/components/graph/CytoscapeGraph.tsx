'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { GraphData, GraphNode, GraphEdge } from '@/types/corruption';
import { LayoutName, layoutOptions } from './graphLayouts';

interface CytoscapeGraphProps {
  data: GraphData;
  layout?: LayoutName;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  className?: string;
}

const nodeColors: Record<string, string> = {
  persona: '#1d4ed8',     // Azul tinta
  empresa: '#d97706',     // Ámbar
  institucion: '#6d28d9', // Púrpura
  organismo: '#15803d',   // Verde
  caso: '#b91c1c',        // Rojo sello
  otro: '#4b5563',        // Grafito
};

const edgeColors: Record<string, string> = {
  trabaja_con: '#1d4ed8',
  familiar: '#be185d',
  financiero: '#b91c1c',
  comercial: '#d97706',
  politico: '#6d28d9',
  involucra: '#4b5563',
  otro: '#78716c',
};

export default function CytoscapeGraph({ 
  data, 
  layout = 'cose',
  onNodeClick, 
  onEdgeClick,
  className = '' 
}: CytoscapeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const elements = [
      ...data.nodes.map((node) => ({
        group: 'nodes' as const,
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
        },
        classes: node.type,
      })),
      ...data.edges.map((edge) => ({
        group: 'edges' as const,
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type,
          weight: edge.weight,
        },
        classes: edge.type,
      })),
    ];

    const style = [
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          'background-color': (ele) => nodeColors[ele.data('type')] || nodeColors.otro,
          color: '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12px',
          'font-weight': 'bold' as cytoscape.Css.FontWeight,
          width: (ele) => (ele.data('type') === 'caso' ? 60 : 40),
          height: (ele) => (ele.data('type') === 'caso' ? 60 : 40),
          'border-width': 2,
          'border-color': '#fff',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'node:active',
        style: {
          'overlay-opacity': 0.2,
          'overlay-color': '#3b82f6',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'edge',
        style: {
          label: 'data(label)',
          width: (ele) => Math.max(1, ele.data('weight') * 4),
          'line-color': (ele) => edgeColors[ele.data('type')] || edgeColors.otro,
          'target-arrow-color': (ele) => edgeColors[ele.data('type')] || edgeColors.otro,
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'font-size': '10px',
          color: '#6b7280',
          'text-rotation': 'autorotate',
        } as cytoscape.Css.Edge,
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 4,
          'border-color': '#fbbf24',
          'background-color': '#fbbf24',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'edge:selected',
        style: {
          width: 4,
          'line-color': '#fbbf24',
        } as cytoscape.Css.Edge,
      },
    ];

    const chosenLayoutOptions = layoutOptions[layout] || layoutOptions.cose;

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style,
      layout: { name: 'null' },
      minZoom: 0.5,
      maxZoom: 3,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
    });

    cyRef.current = cy;

    const activeLayout = cy.layout(chosenLayoutOptions);
    activeLayout.run();

    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeData = node.data();
      const graphNode: GraphNode = {
        id: nodeData.id,
        label: nodeData.label,
        type: nodeData.type,
        data: nodeData,
      };
      setSelectedNode(graphNode);
      onNodeClick?.(graphNode);
    });

    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      const edgeData = edge.data();
      const graphEdge: GraphEdge = {
        id: edgeData.id,
        source: edgeData.source,
        target: edgeData.target,
        label: edgeData.label,
        type: edgeData.type,
        weight: edgeData.weight,
        data: edgeData,
      };
      onEdgeClick?.(graphEdge);
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    return () => {
      try {
        activeLayout.stop();
        cy.stop();
        cy.destroy();
      } catch {
        // Ignorar posibles errores en desmontaje
      }
      cyRef.current = null;
    };
  }, [data, layout, onNodeClick, onEdgeClick]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full bg-[#181920] border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro dark:shadow-none"
        style={{ minHeight: '400px' }}
      />
      
      <div className="absolute top-3 left-3 bg-[#fdfcf9] dark:bg-[#1f2026] p-3 text-xs font-mono border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro-sm dark:shadow-none">
        <h4 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] uppercase tracking-wider mb-2 border-b border-[#1c1917]/20 dark:border-[#3f3f46] pb-1">
          [ Actores ]
        </h4>
        <div className="space-y-1.5">
          {Object.entries(nodeColors).filter(([key]) => key !== 'otro').map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 border border-[#1c1917] dark:border-white inline-block" 
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-[#1c1917] dark:text-[#d4d4d8] uppercase font-medium">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="absolute bottom-3 right-3 bg-[#fdfcf9] dark:bg-[#1f2026] p-4 max-w-xs border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro-sm dark:shadow-none">
          <div className="flex items-center justify-between gap-2 border-b border-[#1c1917]/20 dark:border-[#3f3f46] pb-1.5 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa]">
              [ Ficha ]
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-[#1c1917] dark:border-[#71717a] font-bold">
              {selectedNode.type}
            </span>
          </div>
          <h4 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] text-sm leading-tight">{selectedNode.label}</h4>
          {selectedNode.data && 'descripcion' in selectedNode.data && (
            <p className="text-xs text-[#57534e] dark:text-[#a1a1aa] mt-2 leading-relaxed">{selectedNode.data.descripcion}</p>
          )}
        </div>
      )}
    </div>
  );
}
