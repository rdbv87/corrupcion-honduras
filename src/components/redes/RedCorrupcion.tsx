'use client';

import { useEffect, useRef, useCallback } from 'react';
import cytoscape, { Core, EventObject, LayoutOptions } from 'cytoscape';
import { RedGraphData } from '@/types/corruption';

interface RedCorrupcionProps {
  graphData: RedGraphData;
  actorColors: Record<string, string>;
  onActorClick?: (actor: { id: string; label: string }) => void;
  className?: string;
}

const statusBorderColors: Record<string, string> = {
  condenado: '#dc2626',
  procesado: '#d97706',
  pro_fugo: '#ea580c',
  investigado: '#2563eb',
  absuelto: '#16a34a',
};

const edgeTypeColors: Record<string, string> = {
  financiero: '#ef4444',
  familiar: '#ec4899',
  politico: '#3b82f6',
  empresarial: '#8b5cf6',
  testaferro: '#f59e0b',
};

function buildCoseLayout(cy: Core, opts?: { numIter?: number; randomize?: boolean }): LayoutOptions {
  const len = cy.elements().length || 1;
  return {
    name: 'cose',
    animate: false,
    nodeRepulsion: () => 12000,
    idealEdgeLength: () => 140,
    edgeElasticity: () => Math.max(50, Math.min(120, 4000 / len)),
    gravity: 0.6,
    numIter: opts?.numIter ?? 1500,
    padding: 60,
    randomize: opts?.randomize ?? true,
    ungrabifyWhileSimulating: false,
  } as cytoscape.LayoutOptions;
}

export default function RedCorrupcion({
  graphData,
  actorColors,
  onActorClick,
  className = '',
}: RedCorrupcionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const layoutRef = useRef<cytoscape.Layouts | null>(null);
  const callbackRef = useRef(onActorClick);
  const dragDiffRef = useRef<{ dx: number; dy: number } | null>(null);
  const otherPositionsRef = useRef<Record<string, { x: number; y: number; hop: number; weight: number }>>({});

  useEffect(() => {
    callbackRef.current = onActorClick;
  }, [onActorClick]);

  const stopLayout = useCallback(() => {
    if (layoutRef.current) {
      try {
        layoutRef.current.stop();
      } catch {
        // Ignorar
      }
      layoutRef.current = null;
    }
  }, []);

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
          'background-color': (ele: cytoscape.NodeSingular) => actorColors[ele.data('tipo')] || '#4b5563',
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
          'border-color': (ele: cytoscape.NodeSingular) => statusBorderColors[ele.data('status')] || '#1c1917',
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
          width: (ele: cytoscape.EdgeSingular) => Math.max(1.5, (ele.data('weight') || 1) * 3),
          'line-color': (ele: cytoscape.EdgeSingular) => edgeTypeColors[ele.data('tipo')] || '#78716c',
          'line-opacity': 0.9,
          'target-arrow-color': (ele: cytoscape.EdgeSingular) => edgeTypeColors[ele.data('tipo')] || '#78716c',
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
    });

    cyRef.current = cy;

    layoutRef.current = cy.layout(buildCoseLayout(cy, { numIter: 1500, randomize: true }));
    layoutRef.current.run();

    cy.on('tap', 'node', (evt: EventObject) => {
      const nodeData = evt.target.data();
      callbackRef.current?.({ id: nodeData.id, label: nodeData.label });
    });

    const buildDistanceMap = (grabbedId: string): Map<string, number> => {
      const dist = new Map<string, number>();
      dist.set(grabbedId, 0);
      const queue: string[] = [grabbedId];
      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentDist = dist.get(current)!;
        cy.edges().forEach((e: cytoscape.EdgeSingular) => {
          let target: string | null = null;
          if (e.source().id() === current) target = e.target().id();
          else if (e.target().id() === current) target = e.source().id();
          if (target && !dist.has(target)) {
            dist.set(target, currentDist + 1);
            queue.push(target);
          }
        });
      }
      return dist;
    };

    const elasticityFactor = (hop: number): number => {
      if (hop === 0) return 1;
      // Elasticidad tipo tela de araña: la influencia decae de forma más suave
      // con la distancia, otorgando mayor flexibilidad visual al arrastrar.
      return Math.max(0.06, 1 / Math.pow(hop, 1.2));
    };

    const buildDegreeMap = (): Map<string, number> => {
      const degrees = new Map<string, number>();
      cy.nodes().forEach((n: cytoscape.NodeSingular) => {
        degrees.set(n.id(), 0);
      });
      cy.edges().forEach((e: cytoscape.EdgeSingular) => {
        const src = e.source().id();
        const tgt = e.target().id();
        degrees.set(src, (degrees.get(src) ?? 0) + 1);
        degrees.set(tgt, (degrees.get(tgt) ?? 0) + 1);
      });
      return degrees;
    };

    // Normaliza el grado (número de relaciones) de un nodo a un peso ~0.5..2.5.
    // A mayor número de relaciones (mayor centralidad en la investigación),
    // mayor peso y menor desplazamiento al arrastrar.
    const weightFromDegree = (degree: number): number => {
      if (degree <= 0) return 0.5;
      return Math.min(2.5, 0.5 + degree * 0.45);
    };

    const inertiaFactor = (weight: number): number => {
      // Los nodos más livianos (pocas relaciones) se desplazan más;
      // los más pesados (redes densas) resisten.
      const normalized = Math.max(0.5, Math.min(2.5, weight));
      return 1 / (0.5 + normalized * 0.55);
    };

    cy.on('grab', 'node', (evt: EventObject) => {
      const grabbed = evt.target;
      stopLayout();
      const grabbedId = grabbed.id();
      const degrees = buildDegreeMap();
      const positions: Record<string, { x: number; y: number; hop: number; weight: number }> = {};
      const dist = buildDistanceMap(grabbedId);
      cy.nodes().forEach((n: cytoscape.NodeSingular) => {
        const p = n.position();
        positions[n.id()] = {
          x: p.x,
          y: p.y,
          hop: dist.get(n.id()) ?? 99,
          weight: weightFromDegree(degrees.get(n.id()) ?? 0),
        };
      });
      otherPositionsRef.current = positions;
      dragDiffRef.current = { dx: 0, dy: 0 };
    });

    cy.on('drag', 'node', (evt: EventObject) => {
      const grabbed = evt.target;
      const startDiff = dragDiffRef.current;
      const startPos = otherPositionsRef.current[grabbed.id()];
      if (!startDiff || !startPos) return;

      const currentPos = grabbed.position();
      const dx = currentPos.x - startPos.x;
      const dy = currentPos.y - startPos.y;

      const deltaX = dx - startDiff.dx;
      const deltaY = dy - startDiff.dy;

      if (deltaX === 0 && deltaY === 0) return;

      Object.entries(otherPositionsRef.current).forEach(([id, p]) => {
        if (id === grabbed.id()) return;
        const node = cy.getElementById(id);
        if (!node || node.empty()) return;
        const factor = elasticityFactor(p.hop) * inertiaFactor(p.weight);
        node.position({ x: p.x + dx * factor, y: p.y + dy * factor });
      });

      dragDiffRef.current = { dx, dy };
    });

    cy.on('free', 'node', () => {
      dragDiffRef.current = null;
      otherPositionsRef.current = {};
    });

    return () => {
      try {
        stopLayout();
        cy.stop();
        cy.destroy();
      } catch {
        // Ignorar errores al desmontar
      }
      cyRef.current = null;
    };
  }, [graphData, actorColors, stopLayout]);

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
