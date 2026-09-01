import { NextResponse } from 'next/server';
import { getActoresByCaso } from '@/data/redes';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const actores = getActoresByCaso(params.id);
  return NextResponse.json(actores);
}
