import { 
  Caso, 
  Entidad, 
  Conexion, 
  CasoEntidad, 
  GraphData, 
  GraphNode, 
  GraphEdge 
} from '@/types/corruption';

export function buildGraphData(
  casos: Caso[],
  entidades: Entidad[],
  conexiones: Conexion[],
  casoEntidad: CasoEntidad[]
): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  casos.forEach((caso) => {
    nodes.push({
      id: `caso-${caso.id}`,
      label: caso.titulo.length > 30 ? caso.titulo.substring(0, 30) + '...' : caso.titulo,
      type: 'caso',
      data: caso,
    });
  });

  entidades.forEach((entidad) => {
    nodes.push({
      id: `entidad-${entidad.id}`,
      label: entidad.nombre.length > 25 ? entidad.nombre.substring(0, 25) + '...' : entidad.nombre,
      type: entidad.tipo,
      data: entidad,
    });
  });

  conexiones.forEach((conexion) => {
    edges.push({
      id: `conexion-${conexion.id}`,
      source: `entidad-${conexion.entidad_origen_id}`,
      target: `entidad-${conexion.entidad_destino_id}`,
      label: conexion.tipo.replace('_', ' '),
      type: conexion.tipo,
      weight: conexion.fuerza,
      data: conexion,
    });
  });

  casoEntidad.forEach((ce) => {
    edges.push({
      id: `caso-entidad-${ce.caso_id}-${ce.entidad_id}`,
      source: `caso-${ce.caso_id}`,
      target: `entidad-${ce.entidad_id}`,
      label: ce.rol,
      type: 'involucra',
      weight: 0.5,
      data: ce,
    });
  });

  return { nodes, edges };
}

export function filterGraphByEntityType(
  graphData: GraphData,
  entityTypes: string[]
): GraphData {
  const filteredNodes = graphData.nodes.filter(
    (node) => node.type === 'caso' || entityTypes.includes(node.type)
  );

  const nodeIds = new Set(filteredNodes.map((node) => node.id));

  const filteredEdges = graphData.edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

export function filterGraphByCaseId(
  graphData: GraphData,
  casoId: string
): GraphData {
  const casoNodeId = `caso-${casoId}`;

  const casoEdges = graphData.edges.filter(
    (edge) => edge.source === casoNodeId || edge.target === casoNodeId
  );

  const entityIds = new Set(
    casoEdges.map((edge) =>
      edge.source === casoNodeId ? edge.target : edge.source
    )
  );

  entityIds.add(casoNodeId);

  const filteredNodes = graphData.nodes.filter((node) =>
    entityIds.has(node.id)
  );

  const filteredEdges = graphData.edges.filter(
    (edge) => entityIds.has(edge.source) && entityIds.has(edge.target)
  );

  return {
    nodes: filteredNodes,
    edges: filteredEdges,
  };
}

export function getConnectedEntities(
  graphData: GraphData,
  entityId: string
): GraphNode[] {
  const connectedIds = new Set<string>();

  graphData.edges.forEach((edge) => {
    if (edge.source === entityId) {
      connectedIds.add(edge.target);
    } else if (edge.target === entityId) {
      connectedIds.add(edge.source);
    }
  });

  return graphData.nodes.filter(
    (node) => connectedIds.has(node.id) && node.id !== entityId
  );
}

export function calculateNodeDegree(
  graphData: GraphData,
  nodeId: string
): number {
  return graphData.edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  ).length;
}

export function getMostConnectedEntities(
  graphData: GraphData,
  limit: number = 10
): GraphNode[] {
  const entityNodes = graphData.nodes.filter((node) => node.type !== 'caso');

  const nodesWithDegree = entityNodes.map((node) => ({
    node,
    degree: calculateNodeDegree(graphData, node.id),
  }));

  return nodesWithDegree
    .sort((a, b) => b.degree - a.degree)
    .slice(0, limit)
    .map((item) => item.node);
}
