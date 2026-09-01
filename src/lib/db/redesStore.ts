import { CasoRed, ActorRed, ConexionRed } from '@/types/corruption';
import { allCasosRed, allActoresRed, allConexionesRed } from '@/data/redes';

let casos: CasoRed[] = [...allCasosRed];
let actores: ActorRed[] = [...allActoresRed];
let conexiones: ConexionRed[] = [...allConexionesRed];

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// --- CasosRed ---
export function getCasosRed(): CasoRed[] {
  return [...casos];
}

export function getCasoRed(casoId: string): CasoRed | undefined {
  return casos.find((c) => c.id === casoId);
}

export function createCasoRed(data: Omit<CasoRed, 'id'>): CasoRed {
  const caso: CasoRed = { ...data, id: generateId('caso') };
  casos.push(caso);
  return caso;
}

export function updateCasoRed(id: string, data: Partial<CasoRed>): CasoRed | undefined {
  const idx = casos.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  casos[idx] = { ...casos[idx], ...data, id };
  return casos[idx];
}

export function deleteCasoRed(id: string): boolean {
  const idx = casos.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  casos.splice(idx, 1);
  const actorIds = actores.filter((a) => a.caso_id === id).map((a) => a.id);
  conexiones = conexiones.filter(
    (c) => c.caso_id !== id && !actorIds.includes(c.actor_origen_id) && !actorIds.includes(c.actor_destino_id)
  );
  actores = actores.filter((a) => a.caso_id !== id);
  return true;
}

// --- ActoresRed ---
export function getActoresRed(): ActorRed[] {
  return [...actores];
}

export function getActoresByCaso(casoId: string): ActorRed[] {
  return actores.filter((a) => a.caso_id === casoId);
}

export function getActorRed(id: string): ActorRed | undefined {
  return actores.find((a) => a.id === id);
}

export function createActorRed(data: Omit<ActorRed, 'id'>): ActorRed {
  const actor: ActorRed = { ...data, id: generateId('actor') };
  actores.push(actor);
  return actor;
}

export function updateActorRed(id: string, data: Partial<ActorRed>): ActorRed | undefined {
  const idx = actores.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  actores[idx] = { ...actores[idx], ...data, id };
  return actores[idx];
}

export function deleteActorRed(id: string): boolean {
  const idx = actores.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  actores.splice(idx, 1);
  conexiones = conexiones.filter((c) => c.actor_origen_id !== id && c.actor_destino_id !== id);
  return true;
}

// --- ConexionesRed ---
export function getConexionesRed(): ConexionRed[] {
  return [...conexiones];
}

export function getConexionesByCaso(casoId: string): ConexionRed[] {
  return conexiones.filter((c) => c.caso_id === casoId);
}

export function getConexionRed(id: string): ConexionRed | undefined {
  return conexiones.find((c) => c.id === id);
}

export function createConexionRed(data: Omit<ConexionRed, 'id'>): ConexionRed | null {
  const origen = actores.find((a) => a.id === data.actor_origen_id);
  const destino = actores.find((a) => a.id === data.actor_destino_id);
  if (!origen || !destino || origen.caso_id !== data.caso_id || destino.caso_id !== data.caso_id) {
    return null;
  }
  const conexion: ConexionRed = { ...data, id: generateId('conn') };
  conexiones.push(conexion);
  return conexion;
}

export function updateConexionRed(id: string, data: Partial<ConexionRed>): ConexionRed | null {
  const idx = conexiones.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const merged = { ...conexiones[idx], ...data, id };
  const finalCasoId = merged.caso_id;
  const origen = actores.find((a) => a.id === merged.actor_origen_id);
  const destino = actores.find((a) => a.id === merged.actor_destino_id);
  if (!origen || !destino || origen.caso_id !== finalCasoId || destino.caso_id !== finalCasoId) {
    return null;
  }
  conexiones[idx] = merged;
  return merged;
}

export function deleteConexionRed(id: string): boolean {
  const idx = conexiones.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  conexiones.splice(idx, 1);
  return true;
}

// --- Grafo ---
export function getGraphData(casoId: string) {
  return { actores: getActoresByCaso(casoId), conexiones: getConexionesByCaso(casoId) };
}
