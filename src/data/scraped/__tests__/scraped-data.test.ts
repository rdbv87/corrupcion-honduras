import { informesCnaList, snapshotCna } from '../index';

describe('datos scrapeados del CNA', () => {
  it('expone un snapshot con metadatos de fuente', () => {
    expect(snapshotCna.fuente.id).toBe('cna');
    expect(snapshotCna.fuente.nombre.length).toBeGreaterThan(0);
    expect(snapshotCna.generado_en).toBeTruthy();
  });

  it('contiene informes con título y URL', () => {
    expect(informesCnaList.length).toBeGreaterThan(0);
    for (const informe of informesCnaList) {
      expect(informe.titulo.length).toBeGreaterThan(0);
      expect(informe.url).toMatch(/^https:\/\//);
    }
  });

  it('reporta el total de informes consistente con el arreglo', () => {
    expect(snapshotCna.total_informes).toBe(informesCnaList.length);
  });
});
