import { NextResponse } from 'next/server';
import { scrapeSources } from '@/lib/scraper';

export async function GET() {
  const sources = scrapeSources.map((s) => ({
    id: s.id,
    name: s.name,
    baseUrl: s.baseUrl,
    type: s.type,
    listUrl: s.listUrl,
    enabled: s.enabled,
    rateLimitMs: s.rateLimitMs,
  }));

  return NextResponse.json(sources);
}
