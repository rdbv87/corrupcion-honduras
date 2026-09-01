import { NextRequest, NextResponse } from 'next/server';
import { getEventos, createEvento, searchEventos } from '@/lib/db/store';
import { EventoTemporalType } from '@/types/corruption';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caso_id = searchParams.get('caso_id') || undefined;
  const tipo = searchParams.get('tipo') || undefined;
  const fecha_desde = searchParams.get('fecha_desde') || undefined;
  const fecha_hasta = searchParams.get('fecha_hasta') || undefined;

  const hasFilters = caso_id || tipo || fecha_desde || fecha_hasta;

  if (hasFilters) {
    const results = searchEventos({ caso_id, tipo, fecha_desde, fecha_hasta });
    return NextResponse.json(results);
  }

  return NextResponse.json(getEventos());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.caso_id || !body.titulo || !body.fecha || !body.tipo) {
    return NextResponse.json(
      { error: 'caso_id, titulo, fecha y tipo son requeridos' },
      { status: 400 }
    );
  }

  const evento = createEvento({
    caso_id: body.caso_id,
    titulo: body.titulo,
    descripcion: body.descripcion,
    fecha: new Date(body.fecha),
    tipo: body.tipo as EventoTemporalType,
    metadata: body.metadata,
  });

  return NextResponse.json(evento, { status: 201 });
}
