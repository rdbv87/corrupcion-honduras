import { NextResponse } from 'next/server';
import { allKPIData } from '@/data/kpi';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const indicatorId = searchParams.get('indicator_id');
  const yearFrom = searchParams.get('year_from');
  const yearTo = searchParams.get('year_to');

  let data = allKPIData;

  if (indicatorId) {
    data = data.filter((d) => d.indicator_id === indicatorId);
  }
  if (yearFrom) {
    data = data.filter((d) => d.year >= parseInt(yearFrom, 10));
  }
  if (yearTo) {
    data = data.filter((d) => d.year <= parseInt(yearTo, 10));
  }

  return NextResponse.json(data);
}
