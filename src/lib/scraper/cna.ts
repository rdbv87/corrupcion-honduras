import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';
import { ScrapeResult } from './types';
import { cleanText, extractDate, normalizeUrl, delay } from './utils';

const CNA_SOURCE_ID = 'cna';
const CNA_SOURCE_NAME = 'Consejo Nacional Anticorrupción';
const CNA_BASE_URL = 'https://www.cna.hn';
const CNA_LIST_URL = 'https://www.cna.hn/investigaciones/';
const CNA_RATE_LIMIT_MS = 4000;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Candidatos de monto: Lempiras (L, LPS) y dólares (USD, US$, $)
const MONTO_LPS = /\b(?:L|LPS|L\.|Lps)[\s.]?\d{1,3}(?:[.,]\d{3})*(?:\.\d{1,2})?\b/gi;
const MONTO_USD =
  /\b(?:USD|US\$|\$)[\s]?\d{1,3}(?:[.,]\d{3})*(?:\.\d{1,2})?\b/gi;

export function detectMontos(texto: string | undefined): string[] {
  if (!texto) return [];
  const candidatos: string[] = [];
  const push = (match: string) => {
    if (match) candidatos.push(cleanMonto(match));
  };
  (texto.match(MONTO_LPS) || []).forEach(push);
  (texto.match(MONTO_USD) || []).forEach(push);
  return Array.from(new Set(candidatos));
}

function cleanMonto(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

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

function extractPdfUrl(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<Element>
): string | undefined {
  const links = container.find('a[href]');
  for (let i = 0; i < links.length; i++) {
    const href = links.eq(i).attr('href') || '';
    const lower = href.toLowerCase();
    if (lower.includes('.pdf') || lower.includes('/informe')) {
      return normalizeUrl(href, CNA_BASE_URL);
    }
  }
  return undefined;
}

function extractInformes(html: string): ScrapeResult[] {
  const $ = cheerio.load(html);
  const results: ScrapeResult[] = [];

  $('article, .elementor-post, .jet-listing-grid__item, .post').each((_i, el) => {
    const container = $(el);

    const tituloEl = container.find('h1 a, h2 a, h3 a, h4 a, a').first();
    const titulo = cleanText(tituloEl.text());

    if (!titulo || titulo.length < 8) return;

    let url = '';
    const href = tituloEl.attr('href');
    if (href) {
      url = normalizeUrl(href, CNA_BASE_URL);
    }

    const fechaStr = container.find('time, .date').first().text().trim();
    const resumen =
      cleanText(container.find('.elementor-post__excerpt, .post-excerpt, .entry-summary, p').first().text()) ||
      undefined;
    const contenido =
      cleanText(container.find('.elementor-post__excerpt, .post-content, .entry-content').first().text()) ||
      undefined;

    const fecha = fechaStr ? extractDate(fechaStr) : undefined;
    const pdfUrl = extractPdfUrl($, container);

    results.push({
      sourceId: CNA_SOURCE_ID,
      sourceName: CNA_SOURCE_NAME,
      titulo,
      url: url || `${CNA_BASE_URL}/informes/?s=${encodeURIComponent(titulo)}`,
      tipo: 'informe',
      fecha_publicacion: fecha?.toISOString(),
      contenido,
      resumen,
      pdfUrl,
      montosDetectados: detectMontos(contenido || resumen || titulo),
      scrapeado_en: new Date(),
    });
  });

  return results;
}

export async function scrapeInformesCna(): Promise<ScrapeResult[]> {
  const html = await fetchHtml(CNA_LIST_URL);
  const informes = extractInformes(html);
  await delay(CNA_RATE_LIMIT_MS);
  return informes;
}

export { CNA_SOURCE_ID, CNA_SOURCE_NAME, CNA_BASE_URL, CNA_LIST_URL };
