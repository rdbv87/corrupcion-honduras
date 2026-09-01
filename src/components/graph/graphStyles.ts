export const nodeColors: Record<string, string> = {
  persona: '#1d4ed8',     // Azul tinta
  empresa: '#d97706',     // Ámbar vintage
  institucion: '#6d28d9', // Púrpura archivo
  organismo: '#15803d',   // Verde contable
  caso: '#b91c1c',        // Rojo sello oficial
  otro: '#4b5563',        // Grafito
};

export const edgeColors: Record<string, string> = {
  trabaja_con: '#1d4ed8',
  familiar: '#be185d',
  financiero: '#b91c1c',
  comercial: '#d97706',
  politico: '#6d28d9',
  involucra: '#4b5563',
  otro: '#78716c',
};

export const graphStyles = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'background-color': (ele: { data: (key: string) => string }) => 
        nodeColors[ele.data('type')] || nodeColors.otro,
      color: '#ffffff',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '11px',
      'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'font-weight': 'bold',
      width: (ele: { data: (key: string) => string }) => 
        ele.data('type') === 'caso' ? 64 : 44,
      height: (ele: { data: (key: string) => string }) => 
        ele.data('type') === 'caso' ? 64 : 44,
      'border-width': 2,
      'border-color': '#1c1917',
    },
  },
  {
    selector: 'node:active',
    style: {
      'overlay-opacity': 0.15,
      'overlay-color': '#1c1917',
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(label)',
      width: (ele: { data: (key: string) => number }) => 
        Math.max(1.5, (ele.data('weight') || 1) * 3),
      'line-color': (ele: { data: (key: string) => string }) => 
        edgeColors[ele.data('type')] || edgeColors.otro,
      'target-arrow-color': (ele: { data: (key: string) => string }) => 
        edgeColors[ele.data('type')] || edgeColors.otro,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'font-size': '9px',
      'font-family': 'ui-monospace, monospace',
      color: '#78716c',
      'text-rotation': 'autorotate',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 4,
      'border-color': '#1c1917',
      'background-color': '#f59e0b',
    },
  },
  {
    selector: 'edge:selected',
    style: {
      width: 4,
      'line-color': '#1c1917',
    },
  },
];
