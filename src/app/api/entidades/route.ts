import { NextRequest, NextResponse } from 'next/server';
import { getEntidades, searchEntidades, createEntidad } from '@/lib/db/store';
import { EntityType } from '@/types/corruption';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || undefined;
  const tipo = searchParams.get('tipo') || undefined;
  const ciudad = searchParams.get('ciudad') || undefined;
  const pais = searchParams.get('pais') || undefined;

  const hasFilters = q || tipo || ciudad || pais;

  if (hasFilters) {
    const results = searchEntidades({ q, tipo, ciudad, pais });
    return NextResponse.json(results);
  }

  return NextResponse.json(getEntidades());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.nombre || !body.tipo) {
    return NextResponse.json(
      { error: 'nombre y tipo son requeridos' },
      { status: 400 }
    );
  }

  const entidad = createEntidad({
    nombre: body.nombre,
    tipo: body.tipo as EntityType,
    descripcion: body.descripcion,
    pais: body.pais || 'Honduras',
    ciudad: body.ciudad,
    metadata: body.metadata,
  });

  return NextResponse.json(entidad, { status: 201 });
}
