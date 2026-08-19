export type EntityType = 'persona' | 'empresa' | 'institucion' | 'organismo' | 'otro';
export type CaseStatus = 'abierto' | 'investigacion' | 'cerrado' | 'archivado';
export type ConnectionType = 'trabaja_con' | 'familiar' | 'financiero' | 'comercial' | 'politico' | 'otro';
export type SourceType = 'documento' | 'noticia' | 'testimonio' | 'sentencia' | 'oficial' | 'otro';
export type ImpactType = 'economico' | 'social' | 'ambiental' | 'salud' | 'educacion' | 'otro';

export interface Caso {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_cierre?: Date;
  status: CaseStatus;
  monto_estimado?: number;
  moneda?: string;
  impacto_social?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Entidad {
  id: string;
  nombre: string;
  tipo: EntityType;
  descripcion?: string;
  pais: string;
  ciudad?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface Conexion {
  id: string;
  entidad_origen_id: string;
  entidad_destino_id: string;
  tipo: ConnectionType;
  descripcion?: string;
  fuerza: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface CasoEntidad {
  caso_id: string;
  entidad_id: string;
  rol: string;
  fecha_implicacion?: Date;
}

export interface Fuente {
  id: string;
  titulo: string;
  tipo: SourceType;
  url?: string;
  contenido?: string;
  fecha_publicacion?: Date;
  confiabilidad: number;
  caso_id?: string;
  entidad_id?: string;
  conexion_id?: string;
  created_at: Date;
}

export interface Impacto {
  id: string;
  caso_id: string;
  tipo: ImpactType;
  descripcion: string;
  monto?: number;
  moneda?: string;
  personas_afectadas?: number;
  created_at: Date;
}

export interface EventoTemporal {
  id: string;
  caso_id: string;
  titulo: string;
  descripcion?: string;
  fecha: Date;
  tipo: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType | 'caso';
  data: Caso | Entidad;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: ConnectionType | 'involucra';
  weight: number;
  data: Conexion | CasoEntidad;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
