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

// Categoría raíz "Investigación" del sitio CNA (WordPress). Permite filtrar la
// WP REST API para obtener únicamente posts de investigaciones.
const CNA_CATEGORIA_INVESTIGACION = 207;
// Endpoint REST de WordPress: mucho más fiable que parsear el HTML (que se
// renderiza con JavaScript vía Elementor/ANWP Grid).
const CNA_WP_REST_POSTS = `${CNA_BASE_URL}/wp-json/wp/v2/posts`;

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

// Forma mínima de un post devuelto por la WP REST API del CNA.
interface WpPost {
  id: number;
  date?: string;
  title?: { rendered?: string };
  link?: string;
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  categories?: number[];
  acf?: Record<string, unknown>;
}

/**
 * Extrae la URL del primer enlace PDF dentro de un contenido HTML (p. ej. el
 * content.rendered de un post de WordPress que enlaza el informe en PDF).
 */
function extractPdfFromHtml(html: string | undefined): string | undefined {
  if (!html) return undefined;
  const pdfMatches = Array.from(html.matchAll(/href="([^"]+\.pdf[^"]*)"/gi));
  if (pdfMatches.length === 0) return undefined;
  return normalizeUrl(pdfMatches[0][1], CNA_BASE_URL);
}

/**
 * Scrapea los informes de investigación del CNA usando la WP REST API.
 *
 * La página HTML /investigaciones/ renderiza su grid de informes con JavaScript
 * (Elementor/ANWP), por lo que el parseo estático no encuentra los ítems. La
 * WordPress REST API expone los posts de forma fiable y permite filtrar por la
 * categoría raíz "Investigación".
 */
export async function scrapeInformesCnaRest(): Promise<ScrapeResult[]> {
  const resultados: ScrapeResult[] = [];
  let pagina = 1;
  let hayMas = true;

  while (hayMas) {
    const url = `${CNA_WP_REST_POSTS}?categories=${CNA_CATEGORIA_INVESTIGACION}&per_page=50&page=${pagina}&_fields=id,date,title,link,excerpt,content,categories`;
    const response = await axios.get<WpPost | WpPost[]>(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        'Accept-Language': 'es-HN,es;q=0.9,en;q=0.8',
      },
      timeout: 15000,
      maxRedirects: 3,
    });

    const posts = Array.isArray(response.data) ? response.data : [response.data];
    for (const post of posts) {
      const titulo = cleanText(post.title?.rendered || '');
      if (!titulo) continue;

      const contenido = cleanText(stripTags(post.content?.rendered || ''));
      const resumen = cleanText(stripTags(post.excerpt?.rendered || ''));

      resultados.push({
        sourceId: CNA_SOURCE_ID,
        sourceName: CNA_SOURCE_NAME,
        titulo,
        url: post.link || `${CNA_BASE_URL}/?p=${post.id}`,
        tipo: 'informe',
        fecha_publicacion: post.date ? new Date(post.date).toISOString() : undefined,
        contenido: contenido || undefined,
        resumen: resumen || undefined,
        pdfUrl: extractPdfFromHtml(post.content?.rendered),
        montosDetectados: detectMontos(contenido || resumen || titulo),
        scrapeado_en: new Date(),
      });
    }

    // La API indica que hay más páginas mediante el header X-WP-TotalPages.
    const totalPages = Number(response.headers['x-wp-totalpages'] || 0);
    hayMas = pagina < totalPages;
    pagina += 1;

    await delay(CNA_RATE_LIMIT_MS);
  }

  return resultados;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
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
