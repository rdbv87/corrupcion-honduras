export type EntityType = 'persona' | 'empresa' | 'institucion' | 'organismo' | 'otro';
export type CaseStatus = 'abierto' | 'investigacion' | 'cerrado' | 'archivado';
export type ConnectionType = 'trabaja_con' | 'familiar' | 'financiero' | 'comercial' | 'politico' | 'otro';
export type SourceType = 'documento' | 'noticia' | 'testimonio' | 'sentencia' | 'oficial' | 'informe' | 'otro';
export type ImpactType = 'economico' | 'social' | 'ambiental' | 'salud' | 'educacion' | 'otro';
export type EventoTemporalType = 'investigacion' | 'sentencia' | 'denuncia' | 'resolucion' | 'comparecencia' | 'medida cautelar' | 'otro';

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
  tipo: EventoTemporalType;
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

export type AreaImpacto = 'salud' | 'educacion' | 'empleo' | 'infraestructura' | 'tecnologia' | 'general';

export interface KPIIndicator {
  id: string;
  area: AreaImpacto;
  nombre: string;
  descripcion: string;
  unidad: string;
  fuente: string;
  fuente_url: string;
  color: string;
}

export interface KPIDataPoint {
  indicator_id: string;
  year: number;
  value: number;
  notas?: string;
}

export interface KPISummary {
  area: AreaImpacto;
  indicadores: number;
  ultimo_valor: number;
  ultimo_anio: number;
  tendencia: 'sube' | 'baja' | 'estable';
}

export type StatusLegal = 'condenado' | 'procesado' | 'pro_fugo' | 'investigado' | 'absuelto';
export type TipoActor = 'funcionario' | 'empresario' | 'empresa' | 'testaferro' | 'politico' | 'proveedor';
export type TipoConexionRed = 'financiero' | 'familiar' | 'politico' | 'empresarial' | 'testaferro';

export interface CasoRed {
  id: string;
  titulo: string;
  subtitulo: string;
  periodo: string;
  monto: number;
  moneda: string;
  monto_usd: number;
  descripcion_corta: string;
  fuente_principal: string;
  fuente_url: string;
  status_judicial: string;
}

export interface ActorRed {
  id: string;
  caso_id: string;
  nombre: string;
  tipo_actor: TipoActor;
  rol: string;
  status_legal: StatusLegal;
  organizacion?: string;
  monto_vinculado?: number;
}

export interface ConexionRed {
  id: string;
  caso_id: string;
  actor_origen_id: string;
  actor_destino_id: string;
  tipo: TipoConexionRed;
  descripcion: string;
  monto?: number;
  periodo: string;
}

export interface RedGraphData {
  nodes: { id: string; label: string; tipo: TipoActor; status: StatusLegal; labelShort: string }[];
  edges: { id: string; source: string; target: string; label: string; tipo: TipoConexionRed; weight: number }[];
}
