import { NextRequest, NextResponse } from 'next/server';
import { getCasos, createCaso, searchCasos } from '@/lib/db/store';
import { CaseStatus } from '@/types/corruption';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || undefined;
  const status = searchParams.get('status') || undefined;
  const monto_min = searchParams.get('monto_min');
  const monto_max = searchParams.get('monto_max');
  const fecha_desde = searchParams.get('fecha_desde') || undefined;
  const fecha_hasta = searchParams.get('fecha_hasta') || undefined;

  const hasFilters = q || status || monto_min || monto_max || fecha_desde || fecha_hasta;

  if (hasFilters) {
    const results = searchCasos({
      q,
      status,
      monto_min: monto_min ? Number(monto_min) : undefined,
      monto_max: monto_max ? Number(monto_max) : undefined,
      fecha_desde,
      fecha_hasta,
    });
    return NextResponse.json(results);
  }

  return NextResponse.json(getCasos());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.titulo || !body.descripcion || !body.fecha_inicio) {
    return NextResponse.json(
      { error: 'titulo, descripcion y fecha_inicio son requeridos' },
      { status: 400 }
    );
  }

  const caso = createCaso({
    titulo: body.titulo,
    descripcion: body.descripcion,
    fecha_inicio: new Date(body.fecha_inicio),
    fecha_cierre: body.fecha_cierre ? new Date(body.fecha_cierre) : undefined,
    status: (body.status as CaseStatus) || 'abierto',
    monto_estimado: body.monto_estimado,
    moneda: body.moneda,
    impacto_social: body.impacto_social,
  });

  return NextResponse.json(caso, { status: 201 });
}
