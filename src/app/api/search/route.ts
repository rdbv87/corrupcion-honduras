import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/db/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') || undefined;
  const tipo = searchParams.get('tipo') || undefined;
  const status = searchParams.get('status') || undefined;

  const results = searchAll({ q, tipo, status });

  return NextResponse.json({
    query: q || '',
    total: results.length,
    results,
  });
}
