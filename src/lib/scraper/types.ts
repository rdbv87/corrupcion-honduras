import { SourceType } from '@/types/corruption';

export interface ScrapeSelector {
  container: string;
  title: string;
  link?: string;
  date?: string;
  summary?: string;
  content?: string;
}

export interface ScrapeSource {
  id: string;
  name: string;
  baseUrl: string;
  type: SourceType;
  selectors: ScrapeSelector;
  listUrl?: string;
  enabled: boolean;
  rateLimitMs: number;
}

export interface ScrapeResult {
  sourceId: string;
  sourceName: string;
  titulo: string;
  url: string;
  tipo: SourceType;
  fecha_publicacion?: string;
  contenido?: string;
  resumen?: string;
  pdfUrl?: string;
  montosDetectados?: string[];
  scrapeado_en: Date;
}

export interface ScrapeJob {
  id: string;
  sourceId: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  startedAt?: Date;
  finishedAt?: Date;
  articlesFound: number;
  articlesNew: number;
  articlesDuplicate: number;
  error?: string;
}
