import { NextRequest, NextResponse } from 'next/server';
import {
  getSourceById,
  getEnabledSources,
  scrapeSource,
  scrapeInformesCna,
  CNA_SOURCE_ID,
} from '@/lib/scraper';
import { createFuente, getFuentes } from '@/lib/db/store';
import { ScrapeResult, ScrapeSource } from '@/lib/scraper/types';

function isDuplicate(url: string, existingFuentes: ReturnType<typeof getFuentes>): boolean {
  return existingFuentes.some((f) => f.url === url);
}

function scrapeResultToFuente(result: ScrapeResult) {
  const existing = getFuentes();
  if (isDuplicate(result.url, existing)) {
    return null;
  }

  const contenido = result.contenido || result.resumen || '';
  const esInformeCna = result.sourceId === CNA_SOURCE_ID;
  return createFuente({
    titulo: result.titulo,
    tipo: result.tipo,
    url: result.url,
    contenido,
    fecha_publicacion: result.fecha_publicacion
      ? new Date(result.fecha_publicacion)
      : undefined,
    confiabilidad: esInformeCna ? 0.95 : 0.6,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sourceId = body.sourceId as string | undefined;

  let sources: ScrapeSource[] = [];
  let cnaOnly = false;
  if (sourceId) {
    if (sourceId === CNA_SOURCE_ID) {
      cnaOnly = true;
    } else {
      const source = getSourceById(sourceId);
      if (!source) {
        return NextResponse.json(
          { error: `Fuente '${sourceId}' no encontrada` },
          { status: 404 }
        );
      }
      sources = [source];
    }
  } else {
    sources = getEnabledSources();
  }

  const results: ScrapeResult[] = [];
  const errors: string[] = [];

  if (cnaOnly) {
    try {
      results.push(...(await scrapeInformesCna()));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Consejo Nacional Anticorrupción: ${msg}`);
    }
  } else {
    for (const source of sources) {
      try {
        const sourceResults = await scrapeSource(source);
        results.push(...sourceResults);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${source.name}: ${msg}`);
      }
    }
  }

  let newCount = 0;
  let duplicateCount = 0;

  for (const result of results) {
    const fuente = scrapeResultToFuente(result);
    if (fuente) {
      newCount++;
    } else {
      duplicateCount++;
    }
  }

  return NextResponse.json({
    ok: true,
    sourcesScraped: cnaOnly ? 1 : sources.length,
    articlesFound: results.length,
    articlesNew: newCount,
    articlesDuplicate: duplicateCount,
    montosDetectados: results.reduce<string[]>((acc, r) => {
      if (r.montosDetectados) acc.push(...r.montosDetectados);
      return acc;
    }, []),
    errors,
  });
}
