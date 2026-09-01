/**
 * Script de scraping estático del CNA.
 *
 * Ejecuta el conector CNA existente (scrapeInformesCna) y escribe los
 * resultados como JSON versionados en src/data/scraped/, consumibles por el
 * frontend en build time (stack estático / GitHub Pages).
 *
 * Uso: node --experimental-strip-types scripts/scrape-cna.ts
 * (o: npm run scrape)
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeInformesCnaRest, CNA_SOURCE_ID, CNA_SOURCE_NAME, CNA_BASE_URL } from '../src/lib/scraper/cna';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../src/data/scraped');

interface InformeCompacto {
  titulo: string;
  url: string;
  tipo: string;
  fecha_publicacion?: string;
  resumen?: string;
  pdfUrl?: string;
  montosDetectados: string[];
}

interface ScrapeSnapshot {
  fuente: { id: string; nombre: string; url: string };
  generado_en: string;
  total_informes: number;
  informes: InformeCompacto[];
}

async function run(): Promise<void> {
  console.log('[scrape-cna] Iniciando extracción de informes del CNA (WP REST API)...');
  const resultados = await scrapeInformesCnaRest();

  const informes: InformeCompacto[] = resultados.map((r) => ({
    titulo: r.titulo,
    url: r.url,
    tipo: r.tipo,
    fecha_publicacion: r.fecha_publicacion,
    resumen: r.resumen,
    pdfUrl: r.pdfUrl,
    montosDetectados: r.montosDetectados ?? [],
  }));

  const snapshot: ScrapeSnapshot = {
    fuente: { id: CNA_SOURCE_ID, nombre: CNA_SOURCE_NAME, url: CNA_BASE_URL },
    generado_en: new Date().toISOString(),
    total_informes: informes.length,
    informes,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const dataPath = path.join(OUT_DIR, 'informes-cna.json');
  fs.writeFileSync(dataPath, JSON.stringify(snapshot, null, 2), 'utf-8');

  const indexPath = path.join(OUT_DIR, 'index.json');
  const indice = leerIndiceExistente(indexPath);
  indice.ejecuciones.unshift({
    generado_en: snapshot.generado_en,
    total_informes: informes.length,
    archivo: 'informes-cna.json',
  });
  // Conservar solo las 20 ejecuciones más recientes
  indice.ejecuciones = indice.ejecuciones.slice(0, 20);
  fs.writeFileSync(indexPath, JSON.stringify(indice, null, 2), 'utf-8');

  console.log(`[scrape-cna] ✔ ${informes.length} informes escritos en ${dataPath}`);
}

interface IndiceEjecucion {
  generado_en: string;
  total_informes: number;
  archivo: string;
}

function leerIndiceExistente(indexPath: string): { ejecuciones: IndiceEjecucion[] } {
  try {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.ejecuciones)) {
      return { ejecuciones: parsed.ejecuciones };
    }
  } catch {
    // no existe o no es válido: se inicializa vacío
  }
  return { ejecuciones: [] };
}

run().catch((err) => {
  console.error('[scrape-cna] ✘ Error ejecutando el scraping:', err);
  process.exitCode = 1;
});
