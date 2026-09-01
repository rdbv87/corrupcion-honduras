import informesCna from './informes-cna.json';

export interface InformeCna {
  titulo: string;
  url: string;
  tipo: string;
  fecha_publicacion?: string;
  resumen?: string;
  pdfUrl?: string;
  montosDetectados: string[];
}

export interface SnapshotCna {
  fuente: { id: string; nombre: string; url: string };
  generado_en: string;
  total_informes: number;
  informes: InformeCna[];
}

const snapshot = informesCna as unknown as SnapshotCna;

export const snapshotCna: SnapshotCna = snapshot;
export const informesCnaList: InformeCna[] = snapshot.informes;

export function getInformeCna(url: string): InformeCna | undefined {
  return informesCnaList.find((i) => i.url === url);
}
