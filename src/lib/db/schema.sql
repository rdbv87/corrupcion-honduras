CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE entity_type AS ENUM ('persona', 'empresa', 'institucion', 'organismo', 'otro');
CREATE TYPE case_status AS ENUM ('abierto', 'investigacion', 'cerrado', 'archivado');
CREATE TYPE connection_type AS ENUM ('trabaja_con', 'familiar', 'financiero', 'comercial', 'politico', 'otro');
CREATE TYPE source_type AS ENUM ('documento', 'noticia', 'testimonio', 'sentencia', 'oficial', 'otro');
CREATE TYPE impact_type AS ENUM ('economico', 'social', 'ambiental', 'salud', 'educacion', 'otro');

CREATE TABLE casos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_cierre DATE,
  status case_status NOT NULL DEFAULT 'abierto',
  monto_estimado DECIMAL(15,2),
  moneda VARCHAR(3),
  impacto_social TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entidades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  tipo entity_type NOT NULL,
  descripcion TEXT,
  pais VARCHAR(100) NOT NULL DEFAULT 'Honduras',
  ciudad VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conexiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entidad_origen_id UUID NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  entidad_destino_id UUID NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  tipo connection_type NOT NULL,
  descripcion TEXT,
  fuerza DECIMAL(3,2) CHECK (fuerza >= 0 AND fuerza <= 1),
  fecha_inicio DATE,
  fecha_fin DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK (entidad_origen_id != entidad_destino_id)
);

CREATE TABLE caso_entidad (
  caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
  entidad_id UUID NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  rol VARCHAR(100) NOT NULL,
  fecha_implicacion DATE,
  PRIMARY KEY (caso_id, entidad_id)
);

CREATE TABLE fuentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  tipo source_type NOT NULL,
  url VARCHAR(500),
  contenido TEXT,
  fecha_publicacion DATE,
  confiabilidad DECIMAL(3,2) CHECK (confiabilidad >= 0 AND confiabilidad <= 1),
  caso_id UUID REFERENCES casos(id) ON DELETE SET NULL,
  entidad_id UUID REFERENCES entidades(id) ON DELETE SET NULL,
  conexion_id UUID REFERENCES conexiones(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE impactos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
  tipo impact_type NOT NULL,
  descripcion TEXT NOT NULL,
  monto DECIMAL(15,2),
  moneda VARCHAR(3),
  personas_afectadas INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos_temporales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caso_id UUID NOT NULL REFERENCES casos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_casos_status ON casos(status);
CREATE INDEX idx_casos_fecha ON casos(fecha_inicio);
CREATE INDEX idx_entidades_tipo ON entidades(tipo);
CREATE INDEX idx_entidades_pais ON entidades(pais);
CREATE INDEX idx_conexiones_origen ON conexiones(entidad_origen_id);
CREATE INDEX idx_conexiones_destino ON conexiones(entidad_destino_id);
CREATE INDEX idx_conexiones_tipo ON conexiones(tipo);
CREATE INDEX idx_fuentes_caso ON fuentes(caso_id);
CREATE INDEX idx_fuentes_entidad ON fuentes(entidad_id);
CREATE INDEX idx_impactos_caso ON impactos(caso_id);
CREATE INDEX idx_eventos_caso ON eventos_temporales(caso_id);
CREATE INDEX idx_eventos_fecha ON eventos_temporales(fecha);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_casos_updated_at BEFORE UPDATE ON casos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entidades_updated_at BEFORE UPDATE ON entidades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conexiones_updated_at BEFORE UPDATE ON conexiones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
