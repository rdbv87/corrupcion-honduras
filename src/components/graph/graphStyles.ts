export const nodeColors: Record<string, string> = {
  persona: '#3b82f6',
  empresa: '#10b981',
  institucion: '#8b5cf6',
  organismo: '#f59e0b',
  caso: '#ef4444',
  otro: '#6b7280',
};

export const edgeColors: Record<string, string> = {
  trabaja_con: '#3b82f6',
  familiar: '#ec4899',
  financiero: '#10b981',
  comercial: '#f59e0b',
  politico: '#8b5cf6',
  involucra: '#6b7280',
  otro: '#9ca3af',
};

export const graphStyles = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'background-color': (ele: { data: (key: string) => string }) => 
        nodeColors[ele.data('type')] || nodeColors.otro,
      color: '#fff',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'font-weight': 'bold',
      width: (ele: { data: (key: string) => string }) => 
        ele.data('type') === 'caso' ? 60 : 40,
      height: (ele: { data: (key: string) => string }) => 
        ele.data('type') === 'caso' ? 60 : 40,
      'border-width': 2,
      'border-color': '#fff',
    },
  },
  {
    selector: 'node:active',
    style: {
      'overlay-opacity': 0.2,
      'overlay-color': '#3b82f6',
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(label)',
      width: (ele: { data: (key: string) => number }) => 
        Math.max(1, ele.data('weight') * 4),
      'line-color': (ele: { data: (key: string) => string }) => 
        edgeColors[ele.data('type')] || edgeColors.otro,
      'target-arrow-color': (ele: { data: (key: string) => string }) => 
        edgeColors[ele.data('type')] || edgeColors.otro,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'font-size': '10px',
      color: '#6b7280',
      'text-rotation': 'autorotate',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 4,
      'border-color': '#fbbf24',
      'background-color': '#fbbf24',
    },
  },
  {
    selector: 'edge:selected',
    style: {
      width: 4,
      'line-color': '#fbbf24',
    },
  },
];
