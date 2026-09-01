import { NextResponse } from 'next/server';
import { allCasosRed } from '@/data/redes';

export async function GET() {
  return NextResponse.json(allCasosRed);
}
