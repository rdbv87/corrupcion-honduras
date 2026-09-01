import { NextRequest, NextResponse } from 'next/server';
import { getFuentes, createFuente } from '@/lib/db/store';
import { SourceType } from '@/types/corruption';

export async function GET() {
  return NextResponse.json(getFuentes());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.titulo || !body.tipo) {
    return NextResponse.json(
      { error: 'titulo y tipo son requeridos' },
      { status: 400 }
    );
  }

  const fuente = createFuente({
    titulo: body.titulo,
    tipo: body.tipo as SourceType,
    url: body.url,
    contenido: body.contenido,
    fecha_publicacion: body.fecha_publicacion
      ? new Date(body.fecha_publicacion)
      : undefined,
    confiabilidad: body.confiabilidad ?? 0.5,
    caso_id: body.caso_id,
    entidad_id: body.entidad_id,
    conexion_id: body.conexion_id,
  });

  return NextResponse.json(fuente, { status: 201 });
}
