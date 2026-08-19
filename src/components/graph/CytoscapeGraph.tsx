'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { GraphData, GraphNode, GraphEdge } from '@/types/corruption';

interface CytoscapeGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
  className?: string;
}

const nodeColors: Record<string, string> = {
  persona: '#3b82f6',
  empresa: '#10b981',
  institucion: '#8b5cf6',
  organismo: '#f59e0b',
  caso: '#ef4444',
  otro: '#6b7280',
};

const edgeColors: Record<string, string> = {
  trabaja_con: '#3b82f6',
  familiar: '#ec4899',
  financiero: '#10b981',
  comercial: '#f59e0b',
  politico: '#8b5cf6',
  involucra: '#6b7280',
  otro: '#9ca3af',
};

export default function CytoscapeGraph({ 
  data, 
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

    const layoutOptions: cytoscape.LayoutOptions = {
      name: 'cose',
      animate: true,
      animationDuration: 1000,
      animationEasing: 'ease-in-out-cubic',
      nodeRepulsion: () => 8000,
      idealEdgeLength: () => 100,
      edgeElasticity: () => 100,
      gravity: 0.25,
      numIter: 1000,
      padding: 50,
    };

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style,
      layout: layoutOptions,
      minZoom: 0.5,
      maxZoom: 3,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
    });

    cyRef.current = cy;

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
      cy.destroy();
      cyRef.current = null;
    };
  }, [data, onNodeClick, onEdgeClick]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-900 rounded-lg border border-gray-700"
        style={{ minHeight: '400px' }}
      />
      
      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg p-3 text-sm">
        <h4 className="font-semibold text-white mb-2">Leyenda</h4>
        <div className="space-y-1">
          {Object.entries(nodeColors).filter(([key]) => key !== 'otro').map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-300 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-4 max-w-xs">
          <h4 className="font-semibold text-white">{selectedNode.label}</h4>
          <p className="text-sm text-gray-400 capitalize">{selectedNode.type}</p>
          {selectedNode.data && 'descripcion' in selectedNode.data && (
            <p className="text-sm text-gray-300 mt-2">{selectedNode.data.descripcion}</p>
          )}
        </div>
      )}
    </div>
  );
}
