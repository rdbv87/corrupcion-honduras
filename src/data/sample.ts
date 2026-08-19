import { Caso, Entidad, Conexion, CasoEntidad, Fuente, Impacto, EventoTemporal } from '@/types/corruption';

export const sampleCasos: Caso[] = [
  {
    id: '1',
    titulo: 'Caso RED (Red de Empresas Desarrolladoras)',
    descripcion: 'Red de empresas vinculadas a políticos que recibieron contratos públicos de manera irregular durante el periodo 2010-2018.',
    fecha_inicio: new Date('2010-01-01'),
    fecha_cierre: new Date('2018-12-31'),
    status: 'cerrado',
    monto_estimado: 50000000,
    moneda: 'HNL',
    impacto_social: 'Daño severo a la infraestructura pública y pérdida de confianza ciudadana',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    titulo: 'Caso Hospitales Fantasma',
    descripcion: 'Construcción de hospitales que nunca entraron en funcionamiento, con pagos a empresas fantasma.',
    fecha_inicio: new Date('2014-06-15'),
    status: 'investigacion',
    monto_estimado: 35000000,
    moneda: 'HNL',
    impacto_social: 'Miles de personas sin acceso a servicios de salud',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const sampleEntidades: Entidad[] = [
  {
    id: '1',
    nombre: 'Juan Pérez González',
    tipo: 'persona',
    descripcion: 'Ex funcionario público vinculado a múltiples casos de corrupción',
    pais: 'Honduras',
    ciudad: 'Tegucigalpa',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    nombre: 'Constructora Honduras S.A.',
    tipo: 'empresa',
    descripcion: 'Empresa de construcción con contratos irregulares',
    pais: 'Honduras',
    ciudad: 'San Pedro Sula',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    nombre: 'Ministerio de Salud',
    tipo: 'institucion',
    descripcion: 'Entidad gubernamental responsable de salud pública',
    pais: 'Honduras',
    ciudad: 'Tegucigalpa',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const sampleConexiones: Conexion[] = [
  {
    id: '1',
    entidad_origen_id: '1',
    entidad_destino_id: '2',
    tipo: 'financiero',
    descripcion: 'Pago irregular por servicios de consultoría',
    fuerza: 0.8,
    fecha_inicio: new Date('2012-03-01'),
    fecha_fin: new Date('2016-12-31'),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    entidad_origen_id: '1',
    entidad_destino_id: '3',
    tipo: 'politico',
    descripcion: 'Nombramiento irregular en posición de confianza',
    fuerza: 0.6,
    fecha_inicio: new Date('2010-01-01'),
    fecha_fin: new Date('2014-12-31'),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const sampleCasoEntidad: CasoEntidad[] = [
  { caso_id: '1', entidad_id: '1', rol: 'implicado', fecha_implicacion: new Date('2010-01-01') },
  { caso_id: '1', entidad_id: '2', rol: 'beneficiario', fecha_implicacion: new Date('2012-03-01') },
  { caso_id: '2', entidad_id: '3', rol: 'victima', fecha_implicacion: new Date('2014-06-15') },
];

export const sampleFuentes: Fuente[] = [
  {
    id: '1',
    titulo: 'Informe de la Misión de Apoyo contra la Corrupción',
    tipo: 'oficial',
    url: 'https://example.com/informe-macc',
    fecha_publicacion: new Date('2016-06-01'),
    confiabilidad: 0.9,
    caso_id: '1',
    created_at: new Date(),
  },
  {
    id: '2',
    titulo: 'Artículo: Hospitales que nunca abrieron',
    tipo: 'noticia',
    url: 'https://example.com/hospitales-fantasma',
    fecha_publicacion: new Date('2018-03-15'),
    confiabilidad: 0.7,
    caso_id: '2',
    created_at: new Date(),
  },
];

export const sampleImpactos: Impacto[] = [
  {
    id: '1',
    caso_id: '1',
    tipo: 'economico',
    descripcion: 'Pérdida de 50 millones de lempiras en fondos públicos',
    monto: 50000000,
    moneda: 'HNL',
    personas_afectadas: 1000000,
    created_at: new Date(),
  },
  {
    id: '2',
    caso_id: '2',
    tipo: 'social',
    descripcion: 'Miles de personas sin acceso a servicios de salud básicos',
    personas_afectadas: 500000,
    created_at: new Date(),
  },
];

export const sampleEventos: EventoTemporal[] = [
  {
    id: '1',
    caso_id: '1',
    titulo: 'Inicio de investigaciones',
    descripcion: 'La MACC inicia investigación sobre redes de corrupción',
    fecha: new Date('2015-04-01'),
    tipo: 'investigacion',
    created_at: new Date(),
  },
  {
    id: '2',
    caso_id: '1',
    titulo: 'Sentencia condenatoria',
    descripcion: 'Primer funcionario sentenciado por su participación en la red',
    fecha: new Date('2017-09-15'),
    tipo: 'sentencia',
    created_at: new Date(),
  },
];
