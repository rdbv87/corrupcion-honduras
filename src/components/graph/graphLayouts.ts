import cytoscape from 'cytoscape';

export type LayoutName = 'cose' | 'circle' | 'concentric' | 'breadthfirst' | 'grid' | 'random';

export const layoutOptions: Record<LayoutName, cytoscape.LayoutOptions> = {
  cose: {
    name: 'cose',
    animate: false,
    nodeRepulsion: () => 12000,
    idealEdgeLength: () => 140,
    edgeElasticity: () => 90,
    gravity: 0.6,
    numIter: 1500,
    randomize: true,
    padding: 60,
  } as cytoscape.LayoutOptions,
  circle: {
    name: 'circle',
    animate: false,
    avoidOverlap: true,
    padding: 50,
  } as cytoscape.LayoutOptions,
  concentric: {
    name: 'concentric',
    animate: false,
    concentric: (node: { degree: () => number }) => {
      return node.degree();
    },
    levelWidth: () => 2,
    avoidOverlap: true,
    padding: 50,
  } as cytoscape.LayoutOptions,
  breadthfirst: {
    name: 'breadthfirst',
    animate: false,
    directed: false,
    spacingFactor: 1.5,
    avoidOverlap: true,
    padding: 50,
  } as cytoscape.LayoutOptions,
  grid: {
    name: 'grid',
    animate: false,
    avoidOverlap: true,
    condense: true,
    rows: undefined,
    padding: 50,
  } as cytoscape.LayoutOptions,
  random: {
    name: 'random',
    animate: false,
    padding: 50,
  } as cytoscape.LayoutOptions,
};

export const layoutDescriptions: Record<LayoutName, string> = {
  cose: 'Fuerza dirigida - mejor para redes complejas',
  circle: 'Circular - todos los nodos en círculo',
  concentric: 'Concéntrico - nodos importantes al centro',
  breadthfirst: 'Primer ancho - jerárquico',
  grid: 'Cuadrícula - ordenado en filas y columnas',
  random: 'Aleatorio - posiciones aleatorias',
};
