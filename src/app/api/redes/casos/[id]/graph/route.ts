import { NextResponse } from 'next/server';
import { getActoresByCaso, getConexionesByCaso } from '@/data/redes';
import { RedGraphData } from '@/types/corruption';

const actorColors: Record<string, string> = {
  funcionario: '#ef4444',
  empresario: '#f59e0b',
  empresa: '#8b5cf6',
  testaferro: '#6b7280',
  politico: '#3b82f6',
  proveedor: '#10b981',
};

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const actores = getActoresByCaso(params.id);
  const conexiones = getConexionesByCaso(params.id);

  if (actores.length === 0) {
    return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
  }

  const graphData: RedGraphData = {
    nodes: actores.map((actor) => ({
      id: actor.id,
      label: actor.nombre,
      tipo: actor.tipo_actor,
      status: actor.status_legal,
      labelShort: actor.nombre.length > 20 ? actor.nombre.substring(0, 20) + '...' : actor.nombre,
    })),
    edges: conexiones.map((conn) => ({
      id: conn.id,
      source: conn.actor_origen_id,
      target: conn.actor_destino_id,
      label: conn.descripcion.substring(0, 40) + (conn.descripcion.length > 40 ? '...' : ''),
      tipo: conn.tipo,
      weight: conn.monto ? Math.min(1, conn.monto / 100000000) : 0.3,
    })),
  };

  return NextResponse.json({ graphData, actorColors });
}
