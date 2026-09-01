import { NextResponse } from 'next/server';
import { buildGraphData } from '@/components/graph/graphUtils';
import {
  getCasos,
  getEntidades,
  getConexiones,
  getCasoEntidad,
} from '@/lib/db/store';

export async function GET() {
  const graphData = buildGraphData(
    getCasos(),
    getEntidades(),
    getConexiones(),
    getCasoEntidad()
  );

  return NextResponse.json(graphData);
}
