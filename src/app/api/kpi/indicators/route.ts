import { NextResponse } from 'next/server';
import { kpiIndicators } from '@/data/kpi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');

  let indicators = kpiIndicators;
  if (area) {
    indicators = indicators.filter((i) => i.area === area);
  }

  return NextResponse.json(indicators);
}
