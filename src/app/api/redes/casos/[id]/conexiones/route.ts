import { NextResponse } from 'next/server';
import { getConexionesByCaso } from '@/data/redes';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const conexiones = getConexionesByCaso(params.id);
  return NextResponse.json(conexiones);
}
