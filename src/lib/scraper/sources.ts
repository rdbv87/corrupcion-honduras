import { ScrapeSource } from './types';

export const scrapeSources: ScrapeSource[] = [
  {
    id: 'laprensa',
    name: 'La Prensa',
    baseUrl: 'https://www.laprensa.hn',
    type: 'noticia',
    listUrl: 'https://www.laprensa.hn/categoria/politica',
    selectors: {
      container: 'article, .article-card, .story-card',
      title: 'h2 a, h3 a, .title a',
      link: 'h2 a, h3 a, .title a',
      date: 'time, .date, .timestamp',
      summary: '.summary, .description, p.resume',
    },
    enabled: true,
    rateLimitMs: 2000,
  },
  {
    id: 'elheraldo',
    name: 'El Heraldo',
    baseUrl: 'https://www.elheraldo.hn',
    type: 'noticia',
    listUrl: 'https://www.elheraldo.hn/politica',
    selectors: {
      container: 'article, .article-item, .news-item',
      title: 'h2 a, h3 a, .article-title a',
      link: 'h2 a, h3 a, .article-title a',
      date: 'time, .date, .article-date',
      summary: '.article-summary, .lead, p.intro',
    },
    enabled: true,
    rateLimitMs: 2000,
  },
  {
    id: 'contracorriente',
    name: 'Contra Corriente',
    baseUrl: 'https://contricorriente.hn',
    type: 'noticia',
    listUrl: 'https://contricorriente.hn/category/investigacion/',
    selectors: {
      container: 'article, .post-item, .entry',
      title: 'h2 a, h3 a, .entry-title a',
      link: 'h2 a, h3 a, .entry-title a',
      date: 'time, .date, .entry-date',
      summary: '.entry-summary, .excerpt, p',
    },
    enabled: true,
    rateLimitMs: 2500,
  },
  {
    id: 'gaceta_oficial',
    name: 'Gaceta Oficial de Honduras',
    baseUrl: 'https://www.gacetaoficial.gob.hn',
    type: 'oficial',
    listUrl: 'https://www.gacetaoficial.gob.hn',
    selectors: {
      container: '.document, .gaceta-item, tr',
      title: 'a, .title, td a',
      link: 'a',
      date: '.date, td:nth-child(2)',
    },
    enabled: true,
    rateLimitMs: 3000,
  },
  {
    id: 'cna',
    name: 'Consejo Nacional Anticorrupción',
    baseUrl: 'https://www.cna.hn',
    type: 'informe',
    listUrl: 'https://www.cna.hn/investigaciones/',
    selectors: {
      container: 'article, .elementor-post, .jet-listing-grid__item, .post',
      title: 'h2 a, h3 a, h4 a, .elementor-post__title a, .title a, a',
      link: 'h2 a, h3 a, h4 a, .elementor-post__title a, .title a',
      date: 'time, .elementor-post__date, .date, .jet-listing-dynamic-field',
      summary: '.elementor-post__excerpt, .elementor-post-card__excerpt, .post-excerpt, .entry-summary, p',
      content: '.elementor-post__excerpt, .post-content, .entry-content',
    },
    enabled: true,
    rateLimitMs: 4000,
  },
];

export function getSourceById(id: string): ScrapeSource | undefined {
  return scrapeSources.find((s) => s.id === id);
}

export function getEnabledSources(): ScrapeSource[] {
  return scrapeSources.filter((s) => s.enabled);
}
