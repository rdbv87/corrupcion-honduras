import { NextRequest, NextResponse } from 'next/server';
import { getEntidadById, updateEntidad, deleteEntidad } from '@/lib/db/store';
import { EntityType } from '@/types/corruption';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const entidad = getEntidadById(params.id);
  if (!entidad) {
    return NextResponse.json({ error: 'Entidad no encontrada' }, { status: 404 });
  }
  return NextResponse.json(entidad);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.nombre) updates.nombre = body.nombre;
  if (body.tipo) updates.tipo = body.tipo as EntityType;
  if (body.descripcion !== undefined) updates.descripcion = body.descripcion;
  if (body.pais) updates.pais = body.pais;
  if (body.ciudad !== undefined) updates.ciudad = body.ciudad;
  if (body.metadata) updates.metadata = body.metadata;

  const entidad = updateEntidad(params.id, updates);
  if (!entidad) {
    return NextResponse.json({ error: 'Entidad no encontrada' }, { status: 404 });
  }
  return NextResponse.json(entidad);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteEntidad(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Entidad no encontrada' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
