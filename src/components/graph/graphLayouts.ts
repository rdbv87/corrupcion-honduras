export type LayoutName = 'cose' | 'circle' | 'concentric' | 'breadthfirst' | 'grid' | 'random';

export const layoutOptions: Record<LayoutName, Record<string, unknown>> = {
  cose: {
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
  },
  circle: {
    name: 'circle',
    animate: true,
    animationDuration: 500,
    avoidOverlap: true,
    padding: 50,
  },
  concentric: {
    name: 'concentric',
    animate: true,
    animationDuration: 500,
    concentric: (node: { degree: () => number }) => {
      return node.degree();
    },
    levelWidth: () => 2,
    avoidOverlap: true,
    padding: 50,
  },
  breadthfirst: {
    name: 'breadthfirst',
    animate: true,
    animationDuration: 500,
    directed: false,
    spacingFactor: 1.5,
    avoidOverlap: true,
    padding: 50,
  },
  grid: {
    name: 'grid',
    animate: true,
    animationDuration: 500,
    avoidOverlap: true,
    condense: true,
    rows: undefined,
    padding: 50,
  },
  random: {
    name: 'random',
    animate: true,
    animationDuration: 500,
    padding: 50,
  },
};

export const layoutDescriptions: Record<LayoutName, string> = {
  cose: 'Fuerza dirigida - mejor para redes complejas',
  circle: 'Circular - todos los nodos en círculo',
  concentric: 'Concéntrico - nodos importantes al centro',
  breadthfirst: 'Primer ancho - jerárquico',
  grid: 'Cuadrícula - ordenado en filas y columnas',
  random: 'Aleatorio - posiciones aleatorias',
};
