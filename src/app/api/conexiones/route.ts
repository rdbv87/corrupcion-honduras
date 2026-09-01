import { NextRequest, NextResponse } from 'next/server';
import { getConexiones, createConexion } from '@/lib/db/store';
import { ConnectionType } from '@/types/corruption';

export async function GET() {
  return NextResponse.json(getConexiones());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.entidad_origen_id || !body.entidad_destino_id || !body.tipo) {
    return NextResponse.json(
      { error: 'entidad_origen_id, entidad_destino_id y tipo son requeridos' },
      { status: 400 }
    );
  }

  const conexion = createConexion({
    entidad_origen_id: body.entidad_origen_id,
    entidad_destino_id: body.entidad_destino_id,
    tipo: body.tipo as ConnectionType,
    descripcion: body.descripcion,
    fuerza: body.fuerza ?? 0.5,
    fecha_inicio: body.fecha_inicio ? new Date(body.fecha_inicio) : undefined,
    fecha_fin: body.fecha_fin ? new Date(body.fecha_fin) : undefined,
    metadata: body.metadata,
  });

  return NextResponse.json(conexion, { status: 201 });
}
