import { NextResponse } from 'next/server';
import { getCasoRed } from '@/data/redes';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const caso = getCasoRed(params.id);
  if (!caso) {
    return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
  }
  return NextResponse.json(caso);
}
