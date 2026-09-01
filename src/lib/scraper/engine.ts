import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapeSource, ScrapeResult, ScrapeSelector } from './types';
import { cleanText, extractDate, normalizeUrl, delay } from './utils';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchHtml(url: string): Promise<string> {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-HN,es;q=0.9,en;q=0.8',
    },
    timeout: 15000,
    maxRedirects: 3,
  });
  return response.data;
}

function extractArticles(
  html: string,
  source: ScrapeSource
): ScrapeResult[] {
  const $ = cheerio.load(html);
  const { selectors, baseUrl, type, id, name } = source;
  const results: ScrapeResult[] = [];

  $(selectors.container).each((_i, el) => {
    const container = $(el);

    const titleEl = container.find(selectors.title).first();
    const titulo = cleanText(titleEl.text());

    if (!titulo || titulo.length < 10) return;

    let url = '';
    if (selectors.link) {
      const linkEl = container.find(selectors.link).first();
      const href = linkEl.attr('href');
      if (href) {
        url = normalizeUrl(href, baseUrl);
      }
    }

    let fechaStr: string | undefined;
    if (selectors.date) {
      fechaStr = container.find(selectors.date).first().text().trim() || undefined;
    }

    let resumen: string | undefined;
    if (selectors.summary) {
      resumen = cleanText(container.find(selectors.summary).first().text()) || undefined;
    }

    let contenido: string | undefined;
    if (selectors.content) {
      contenido = cleanText(container.find(selectors.content).first().text()) || undefined;
    }

    const fecha = fechaStr ? extractDate(fechaStr) : undefined;

    results.push({
      sourceId: id,
      sourceName: name,
      titulo,
      url: url || `${baseUrl}/article/${encodeURIComponent(titulo)}`,
      tipo: type,
      fecha_publicacion: fecha?.toISOString(),
      contenido,
      resumen,
      scrapeado_en: new Date(),
    });
  });

  return results;
}

export async function scrapeSource(
  source: ScrapeSource,
  onProgress?: (found: number) => void
): Promise<ScrapeResult[]> {
  const listUrl = source.listUrl || source.baseUrl;

  const html = await fetchHtml(listUrl);
  const articles = extractArticles(html, source);

  onProgress?.(articles.length);

  return articles;
}

export async function scrapeAllSources(
  sources: ScrapeSource[],
  onSourceComplete?: (sourceId: string, count: number) => void
): Promise<ScrapeResult[]> {
  const allResults: ScrapeResult[] = [];

  for (const source of sources) {
    try {
      const results = await scrapeSource(source, (count) => {
        onSourceComplete?.(source.id, count);
      });
      allResults.push(...results);
    } catch {
      // Skip failed sources silently
    }

    await delay(source.rateLimitMs);
  }

  return allResults;
}
