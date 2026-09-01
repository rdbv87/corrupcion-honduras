'use client';

import { useEffect, useRef } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { RedGraphData } from '@/types/corruption';

interface RedCorrupcionProps {
  graphData: RedGraphData;
  actorColors: Record<string, string>;
  onActorClick?: (actor: { id: string; label: string }) => void;
  className?: string;
}

const statusBorderColors: Record<string, string> = {
  condenado: '#dc2626',   // Rojo sello
  procesado: '#d97706',   // Ocre
  pro_fugo: '#ea580c',    // Terracota
  investigado: '#2563eb', // Azul tinta
  absuelto: '#16a34a',    // Verde contable
};

const edgeTypeColors: Record<string, string> = {
  financiero: '#ef4444',
  familiar: '#ec4899',
  politico: '#3b82f6',
  empresarial: '#8b5cf6',
  testaferro: '#f59e0b',
};

export default function RedCorrupcion({
  graphData,
  actorColors,
  onActorClick,
  className = '',
}: RedCorrupcionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    const elements = [
      ...graphData.nodes.map((node) => ({
        group: 'nodes' as const,
        data: {
          id: node.id,
          label: node.labelShort,
          tipo: node.tipo,
          status: node.status,
        },
        classes: `${node.tipo} ${node.status}`,
      })),
      ...graphData.edges.map((edge) => ({
        group: 'edges' as const,
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label.substring(0, 30),
          tipo: edge.tipo,
          weight: edge.weight,
        },
        classes: edge.tipo,
      })),
    ];

    const style = [
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          'background-color': (ele) => actorColors[ele.data('tipo')] || '#4b5563',
          color: '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'wrap',
          'text-max-width': '80px',
          'text-background-color': '#181920',
          'text-background-opacity': 0.55,
          'text-background-padding': '3px',
          'text-background-shape': 'roundrectangle',
          'font-size': '10px',
          'font-family': 'ui-monospace, monospace',
          'font-weight': 'bold' as cytoscape.Css.FontWeight,
          width: 48,
          height: 48,
          'border-width': 3,
          'border-color': (ele) => statusBorderColors[ele.data('status')] || '#1c1917',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'node:active',
        style: {
          'overlay-opacity': 0.2,
          'overlay-color': '#1c1917',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'edge',
        style: {
          label: 'data(label)',
          width: (ele) => Math.max(1.5, (ele.data('weight') || 1) * 3),
          'line-color': (ele) => edgeTypeColors[ele.data('tipo')] || '#78716c',
          'line-opacity': 0.9,
          'target-arrow-color': (ele) => edgeTypeColors[ele.data('tipo')] || '#78716c',
          'target-arrow-shape': 'triangle',
          'target-arrow-fill': 'filled',
          'arrow-scale': 1.2,
          'curve-style': 'bezier',
          'font-size': '9px',
          'font-family': 'ui-monospace, monospace',
          color: '#d4d4d8',
          'text-background-color': '#181920',
          'text-background-opacity': 0.7,
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle',
          'text-rotation': 'autorotate',
        } as cytoscape.Css.Edge,
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 5,
          'border-color': '#fbbf24',
          'background-color': '#1c1917',
        } as cytoscape.Css.Node,
      },
      {
        selector: 'edge:selected',
        style: {
          width: 5,
          'line-color': '#fbbf24',
          'target-arrow-color': '#fbbf24',
        } as cytoscape.Css.Edge,
      },
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style,
      layout: { name: 'null' },
      minZoom: 0.3,
      maxZoom: 3,
      boxSelectionEnabled: false,
      wheelSensitivity: 0.2,
    });

    cyRef.current = cy;

    const activeLayout = cy.layout({
      name: 'cose',
      animate: false,
      nodeRepulsion: () => 12000,
      idealEdgeLength: () => 140,
      edgeElasticity: (edge) => {
        const len = cy.elements().length || 1;
        return Math.max(50, Math.min(120, 4000 / len));
      },
      gravity: 0.6,
      numIter: 1500,
      padding: 60,
      randomize: true,
    } as cytoscape.LayoutOptions);

    activeLayout.run();

    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeData = evt.target.data();
      onActorClick?.({ id: nodeData.id, label: nodeData.label });
    });

    return () => {
      try {
        activeLayout.stop();
        cy.stop();
        cy.destroy();
      } catch {
        // Ignorar errores al desmontar
      }
      cyRef.current = null;
    };
  }, [graphData, actorColors, onActorClick]);

  const legendEntries = Object.entries(actorColors).filter(([k]) => k !== 'otro');

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full bg-[#181920] border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro dark:shadow-none"
        style={{ minHeight: '400px', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
      />

      <div className="absolute top-3 left-3 bg-[#fdfcf9] dark:bg-[#1f2026] p-3 text-xs font-mono border-2 border-[#1c1917] dark:border-[#3f3f46] shadow-retro-sm dark:shadow-none">
        <h4 className="font-bold text-[#1c1917] dark:text-[#f4f4f5] uppercase tracking-wider mb-2 border-b border-[#1c1917]/20 dark:border-[#3f3f46] pb-1">
          [ Actores ]
        </h4>
        <div className="space-y-1">
          {legendEntries.map(([type, color]) => (
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
        <div className="mt-2.5 pt-2 border-t border-[#1c1917]/20 dark:border-[#3f3f46]">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#78716c] dark:text-[#a1a1aa] mb-1">
            Borde = Estado
          </h5>
          <div className="space-y-0.5">
            {Object.entries(statusBorderColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 border-2 inline-block bg-transparent"
                  style={{ borderColor: color }}
                  aria-hidden="true"
                />
                <span className="text-[#57534e] dark:text-[#a1a1aa] text-[11px] uppercase">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
