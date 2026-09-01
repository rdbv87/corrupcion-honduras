import { NextRequest, NextResponse } from 'next/server';
import { getConexionById, updateConexion, deleteConexion } from '@/lib/db/store';
import { ConnectionType } from '@/types/corruption';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conexion = getConexionById(params.id);
  if (!conexion) {
    return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
  }
  return NextResponse.json(conexion);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.entidad_origen_id) updates.entidad_origen_id = body.entidad_origen_id;
  if (body.entidad_destino_id) updates.entidad_destino_id = body.entidad_destino_id;
  if (body.tipo) updates.tipo = body.tipo as ConnectionType;
  if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
  if (body.fuerza !== undefined) updates.fuerza = body.fuerza;
  if (body.fecha_inicio) updates.fecha_inicio = new Date(body.fecha_inicio);
  if (body.fecha_fin) updates.fecha_fin = new Date(body.fecha_fin);
  if (body.metadata) updates.metadata = body.metadata;

  const conexion = updateConexion(params.id, updates);
  if (!conexion) {
    return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
  }
  return NextResponse.json(conexion);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteConexion(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Conexión no encontrada' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
