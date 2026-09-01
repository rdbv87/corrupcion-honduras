import { NextRequest, NextResponse } from 'next/server';
import { getCasoById, updateCaso, deleteCaso } from '@/lib/db/store';
import { CaseStatus } from '@/types/corruption';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const caso = getCasoById(params.id);
  if (!caso) {
    return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
  }
  return NextResponse.json(caso);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.titulo) updates.titulo = body.titulo;
  if (body.descripcion) updates.descripcion = body.descripcion;
  if (body.fecha_inicio) updates.fecha_inicio = new Date(body.fecha_inicio);
  if (body.fecha_cierre) updates.fecha_cierre = new Date(body.fecha_cierre);
  if (body.status) updates.status = body.status as CaseStatus;
  if (body.monto_estimado !== undefined) updates.monto_estimado = body.monto_estimado;
  if (body.moneda) updates.moneda = body.moneda;
  if (body.impacto_social !== undefined) updates.impacto_social = body.impacto_social;

  const caso = updateCaso(params.id, updates);
  if (!caso) {
    return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
  }
  return NextResponse.json(caso);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = deleteCaso(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
