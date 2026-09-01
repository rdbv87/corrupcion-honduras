export { ihssCaso, ihssActores, ihssConexiones } from './ihss';
export { hospitalesCaso, hospitalesActores, hospitalesConexiones } from './hospitales-moviles';
export { pandoraCaso, pandoraActores, pandoraConexiones } from './pandora';
export { prafCaso, prafActores, prafConexiones } from './praf';
export { rosaCaso, rosaActores, rosaConexiones } from './rosa-de-lobo';

import { CasoRed, ActorRed, ConexionRed } from '@/types/corruption';
import { ihssCaso, ihssActores, ihssConexiones } from './ihss';
import { hospitalesCaso, hospitalesActores, hospitalesConexiones } from './hospitales-moviles';
import { pandoraCaso, pandoraActores, pandoraConexiones } from './pandora';
import { prafCaso, prafActores, prafConexiones } from './praf';
import { rosaCaso, rosaActores, rosaConexiones } from './rosa-de-lobo';

export const allCasosRed: CasoRed[] = [
  ihssCaso,
  hospitalesCaso,
  pandoraCaso,
  prafCaso,
  rosaCaso,
];
export const allActoresRed: ActorRed[] = [
  ...ihssActores,
  ...hospitalesActores,
  ...pandoraActores,
  ...prafActores,
  ...rosaActores,
];
export const allConexionesRed: ConexionRed[] = [
  ...ihssConexiones,
  ...hospitalesConexiones,
  ...pandoraConexiones,
  ...prafConexiones,
  ...rosaConexiones,
];

export function getCasoRed(casoId: string): CasoRed | undefined {
  return allCasosRed.find((c) => c.id === casoId);
}

export function getActoresByCaso(casoId: string): ActorRed[] {
  return allActoresRed.filter((a) => a.caso_id === casoId);
}

export function getConexionesByCaso(casoId: string): ConexionRed[] {
  return allConexionesRed.filter((c) => c.caso_id === casoId);
}
