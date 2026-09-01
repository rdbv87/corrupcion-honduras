import { NextRequest, NextResponse } from 'next/server';
import { getImpactos, createImpacto } from '@/lib/db/store';
import { ImpactType } from '@/types/corruption';

export async function GET() {
  return NextResponse.json(getImpactos());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.caso_id || !body.tipo || !body.descripcion) {
    return NextResponse.json(
      { error: 'caso_id, tipo y descripcion son requeridos' },
      { status: 400 }
    );
  }

  const impacto = createImpacto({
    caso_id: body.caso_id,
    tipo: body.tipo as ImpactType,
    descripcion: body.descripcion,
    monto: body.monto,
    moneda: body.moneda,
    personas_afectadas: body.personas_afectadas,
  });

  return NextResponse.json(impacto, { status: 201 });
}
