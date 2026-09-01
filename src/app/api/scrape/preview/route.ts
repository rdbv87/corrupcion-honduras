import { NextRequest, NextResponse } from 'next/server';
import { getSourceById, scrapeSource } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sourceId = body.sourceId as string;

  if (!sourceId) {
    return NextResponse.json(
      { error: 'sourceId es requerido' },
      { status: 400 }
    );
  }

  const source = getSourceById(sourceId);
  if (!source) {
    return NextResponse.json(
      { error: `Fuente '${sourceId}' no encontrada` },
      { status: 404 }
    );
  }

  try {
    const results = await scrapeSource(source);
    return NextResponse.json({
      ok: true,
      sourceId,
      sourceName: source.name,
      articlesFound: results.length,
      articles: results.slice(0, 10),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Error al hacer scrape: ${msg}` },
      { status: 500 }
    );
  }
}
