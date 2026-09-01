import {
  Caso,
  Entidad,
  Conexion,
  CasoEntidad,
  Fuente,
  Impacto,
  EventoTemporal,
} from '@/types/corruption';
import {
  sampleCasos,
  sampleEntidades,
  sampleConexiones,
  sampleCasoEntidad,
  sampleFuentes,
  sampleImpactos,
  sampleEventos,
} from '@/data/sample';

let casos: Caso[] = [...sampleCasos];
let entidades: Entidad[] = [...sampleEntidades];
let conexiones: Conexion[] = [...sampleConexiones];
let casoEntidad: CasoEntidad[] = [...sampleCasoEntidad];
let fuentes: Fuente[] = [...sampleFuentes];
let impactos: Impacto[] = [...sampleImpactos];
let eventos: EventoTemporal[] = [...sampleEventos];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// --- Casos ---
export function getCasos(): Caso[] {
  return casos;
}

export function getCasoById(id: string): Caso | undefined {
  return casos.find((c) => c.id === id);
}

export function createCaso(data: Omit<Caso, 'id' | 'created_at' | 'updated_at'>): Caso {
  const now = new Date();
  const caso: Caso = { ...data, id: generateId(), created_at: now, updated_at: now };
  casos.push(caso);
  return caso;
}

export function updateCaso(id: string, data: Partial<Caso>): Caso | undefined {
  const idx = casos.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  casos[idx] = { ...casos[idx], ...data, updated_at: new Date() };
  return casos[idx];
}

export function deleteCaso(id: string): boolean {
  const idx = casos.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  casos.splice(idx, 1);
  return true;
}

// --- Entidades ---
export function getEntidades(): Entidad[] {
  return entidades;
}

export function getEntidadById(id: string): Entidad | undefined {
  return entidades.find((e) => e.id === id);
}

export function createEntidad(data: Omit<Entidad, 'id' | 'created_at' | 'updated_at'>): Entidad {
  const now = new Date();
  const entidad: Entidad = { ...data, id: generateId(), created_at: now, updated_at: now };
  entidades.push(entidad);
  return entidad;
}

export function updateEntidad(id: string, data: Partial<Entidad>): Entidad | undefined {
  const idx = entidades.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  entidades[idx] = { ...entidades[idx], ...data, updated_at: new Date() };
  return entidades[idx];
}

export function deleteEntidad(id: string): boolean {
  const idx = entidades.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entidades.splice(idx, 1);
  return true;
}

// --- Conexiones ---
export function getConexiones(): Conexion[] {
  return conexiones;
}

export function getConexionById(id: string): Conexion | undefined {
  return conexiones.find((c) => c.id === id);
}

export function createConexion(data: Omit<Conexion, 'id' | 'created_at' | 'updated_at'>): Conexion {
  const now = new Date();
  const conexion: Conexion = { ...data, id: generateId(), created_at: now, updated_at: now };
  conexiones.push(conexion);
  return conexion;
}

export function updateConexion(id: string, data: Partial<Conexion>): Conexion | undefined {
  const idx = conexiones.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  conexiones[idx] = { ...conexiones[idx], ...data, updated_at: new Date() };
  return conexiones[idx];
}

export function deleteConexion(id: string): boolean {
  const idx = conexiones.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  conexiones.splice(idx, 1);
  return true;
}

// --- CasoEntidad ---
export function getCasoEntidad(): CasoEntidad[] {
  return casoEntidad;
}

export function createCasoEntidad(data: CasoEntidad): CasoEntidad {
  casoEntidad.push(data);
  return data;
}

// --- Fuentes ---
export function getFuentes(): Fuente[] {
  return fuentes;
}

export function getFuenteById(id: string): Fuente | undefined {
  return fuentes.find((f) => f.id === id);
}

export function createFuente(data: Omit<Fuente, 'id' | 'created_at'>): Fuente {
  const fuente: Fuente = { ...data, id: generateId(), created_at: new Date() };
  fuentes.push(fuente);
  return fuente;
}

export function updateFuente(id: string, data: Partial<Fuente>): Fuente | undefined {
  const idx = fuentes.findIndex((f) => f.id === id);
  if (idx === -1) return undefined;
  fuentes[idx] = { ...fuentes[idx], ...data };
  return fuentes[idx];
}

export function getFuenteByUrl(url: string): Fuente | undefined {
  return fuentes.find((f) => f.url === url);
}

export function deleteFuente(id: string): boolean {
  const idx = fuentes.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  fuentes.splice(idx, 1);
  return true;
}

// --- Impactos ---
export function getImpactos(): Impacto[] {
  return impactos;
}

export function getImpactoById(id: string): Impacto | undefined {
  return impactos.find((i) => i.id === id);
}

export function createImpacto(data: Omit<Impacto, 'id' | 'created_at'>): Impacto {
  const impacto: Impacto = { ...data, id: generateId(), created_at: new Date() };
  impactos.push(impacto);
  return impacto;
}

export function deleteImpacto(id: string): boolean {
  const idx = impactos.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  impactos.splice(idx, 1);
  return true;
}

// --- Eventos Temporales ---
export function getEventos(): EventoTemporal[] {
  return eventos;
}

export function getEventoById(id: string): EventoTemporal | undefined {
  return eventos.find((e) => e.id === id);
}

export function createEvento(data: Omit<EventoTemporal, 'id' | 'created_at'>): EventoTemporal {
  const evento: EventoTemporal = { ...data, id: generateId(), created_at: new Date() };
  eventos.push(evento);
  return evento;
}

export function deleteEvento(id: string): boolean {
  const idx = eventos.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  eventos.splice(idx, 1);
  return true;
}

export function updateEvento(id: string, data: Partial<EventoTemporal>): EventoTemporal | undefined {
  const idx = eventos.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  eventos[idx] = { ...eventos[idx], ...data };
  return eventos[idx];
}

export function getEventosByCasoId(casoId: string): EventoTemporal[] {
  return eventos
    .filter((e) => e.caso_id === casoId)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

export interface EventoFilters {
  caso_id?: string;
  tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export function searchEventos(filters: EventoFilters): EventoTemporal[] {
  let results = [...eventos];

  if (filters.caso_id) {
    results = results.filter((e) => e.caso_id === filters.caso_id);
  }

  if (filters.tipo) {
    results = results.filter((e) => e.tipo === filters.tipo);
  }

  if (filters.fecha_desde) {
    const desde = new Date(filters.fecha_desde);
    results = results.filter((e) => new Date(e.fecha) >= desde);
  }

  if (filters.fecha_hasta) {
    const hasta = new Date(filters.fecha_hasta);
    results = results.filter((e) => new Date(e.fecha) <= hasta);
  }

  return results.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
}

// --- Búsqueda y Filtros ---
export interface CasoFilters {
  q?: string;
  status?: string;
  monto_min?: number;
  monto_max?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface EntidadFilters {
  q?: string;
  tipo?: string;
  ciudad?: string;
  pais?: string;
}

export interface SearchFilters {
  q?: string;
  tipo?: string;
  status?: string;
}

function matchesText(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function searchCasos(filters: CasoFilters): Caso[] {
  let results = [...casos];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (c) =>
        c.titulo.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q) ||
        (c.impacto_social && c.impacto_social.toLowerCase().includes(q))
    );
  }

  if (filters.status) {
    results = results.filter((c) => c.status === filters.status);
  }

  if (filters.monto_min !== undefined) {
    results = results.filter((c) => c.monto_estimado !== undefined && c.monto_estimado >= filters.monto_min!);
  }

  if (filters.monto_max !== undefined) {
    results = results.filter((c) => c.monto_estimado !== undefined && c.monto_estimado <= filters.monto_max!);
  }

  if (filters.fecha_desde) {
    const desde = new Date(filters.fecha_desde);
    results = results.filter((c) => new Date(c.fecha_inicio) >= desde);
  }

  if (filters.fecha_hasta) {
    const hasta = new Date(filters.fecha_hasta);
    results = results.filter((c) => new Date(c.fecha_inicio) <= hasta);
  }

  return results;
}

export function searchEntidades(filters: EntidadFilters): Entidad[] {
  let results = [...entidades];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (e) =>
        e.nombre.toLowerCase().includes(q) ||
        (e.descripcion && e.descripcion.toLowerCase().includes(q)) ||
        e.ciudad?.toLowerCase().includes(q)
    );
  }

  if (filters.tipo) {
    results = results.filter((e) => e.tipo === filters.tipo);
  }

  if (filters.ciudad) {
    results = results.filter((e) => matchesText(e.ciudad || '', filters.ciudad!));
  }

  if (filters.pais) {
    results = results.filter((e) => matchesText(e.pais, filters.pais!));
  }

  return results;
}

export function searchConexiones(tipo?: string): Conexion[] {
  if (!tipo) return [...conexiones];
  return conexiones.filter((c) => c.tipo === tipo);
}

export interface SearchResult {
  type: 'caso' | 'entidad' | 'conexion' | 'fuente' | 'impacto' | 'evento';
  id: string;
  titulo: string;
  descripcion?: string;
  relevance: number;
}

export function searchAll(filters: SearchFilters): SearchResult[] {
  const results: SearchResult[] = [];
  const q = filters.q?.toLowerCase() || '';

  for (const c of casos) {
    if (filters.status && c.status !== filters.status) continue;
    const score = q
      ? (matchesText(c.titulo, q) ? 3 : 0) + (matchesText(c.descripcion, q) ? 2 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'caso',
        id: c.id,
        titulo: c.titulo,
        descripcion: c.descripcion,
        relevance: score,
      });
    }
  }

  for (const e of entidades) {
    if (filters.tipo && e.tipo !== filters.tipo) continue;
    const score = q
      ? (matchesText(e.nombre, q) ? 3 : 0) + (matchesText(e.descripcion || '', q) ? 2 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'entidad',
        id: e.id,
        titulo: e.nombre,
        descripcion: e.descripcion,
        relevance: score,
      });
    }
  }

  for (const cn of conexiones) {
    if (filters.tipo && cn.tipo !== filters.tipo) continue;
    const score = q
      ? (matchesText(cn.descripcion || '', q) ? 2 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'conexion',
        id: cn.id,
        titulo: `${cn.tipo} (fuerza: ${cn.fuerza})`,
        descripcion: cn.descripcion,
        relevance: score,
      });
    }
  }

  for (const f of fuentes) {
    const score = q
      ? (matchesText(f.titulo, q) ? 3 : 0) + (matchesText(f.contenido || '', q) ? 1 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'fuente',
        id: f.id,
        titulo: f.titulo,
        descripcion: f.contenido,
        relevance: score,
      });
    }
  }

  for (const i of impactos) {
    const score = q
      ? (matchesText(i.descripcion, q) ? 2 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'impacto',
        id: i.id,
        titulo: `${i.tipo} - caso ${i.caso_id}`,
        descripcion: i.descripcion,
        relevance: score,
      });
    }
  }

  for (const ev of eventos) {
    const score = q
      ? (matchesText(ev.titulo, q) ? 3 : 0) + (matchesText(ev.descripcion || '', q) ? 1 : 0)
      : 1;
    if (score > 0) {
      results.push({
        type: 'evento',
        id: ev.id,
        titulo: ev.titulo,
        descripcion: ev.descripcion,
        relevance: score,
      });
    }
  }

  results.sort((a, b) => b.relevance - a.relevance);
  return results;
}
