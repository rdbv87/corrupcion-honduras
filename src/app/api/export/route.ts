import { NextRequest, NextResponse } from 'next/server';
import {
  getCasos,
  getEntidades,
  getConexiones,
  getFuentes,
  getImpactos,
  getEventos,
} from '@/lib/db/store';

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    const values = headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get('format') as 'csv' | 'json') || 'json';
  const tipo = searchParams.get('tipo') || 'all';

  const data: Record<string, unknown[]> = {};

  if (tipo === 'all' || tipo === 'casos') data.casos = getCasos();
  if (tipo === 'all' || tipo === 'entidades') data.entidades = getEntidades();
  if (tipo === 'all' || tipo === 'conexiones') data.conexiones = getConexiones();
  if (tipo === 'all' || tipo === 'fuentes') data.fuentes = getFuentes();
  if (tipo === 'all' || tipo === 'impactos') data.impactos = getImpactos();
  if (tipo === 'all' || tipo === 'eventos') data.eventos = getEventos();

  if (format === 'csv') {
    const firstKey = Object.keys(data)[0];
    if (!firstKey) {
      return new NextResponse('No data', { status: 404 });
    }
    const csv = toCsv(data[firstKey] as Record<string, unknown>[]);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${firstKey}_export.csv"`,
      },
    });
  }

  return NextResponse.json(data, {
    headers: {
      'Content-Disposition': `attachment; filename="corrupcion_hn_export.json"`,
    },
  });
}
