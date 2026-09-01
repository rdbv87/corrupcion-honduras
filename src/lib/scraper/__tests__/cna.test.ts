import { detectMontos } from '../cna';

describe('detectMontos', () => {
  it('detecta montos en lempiras', () => {
    const m = detectMontos('Se desviaron L 2,500,000 y otros L 150,000 para fines ilícitos.');
    expect(m).toEqual(['L 2,500,000', 'L 150,000']);
  });

  it('detecta montos en dólares', () => {
    const m = detectMontos('El perjuicio fue de USD 3,000,000 o US$ 2,000.');
    expect(m).toContain('USD 3,000,000');
    expect(m).toContain('US$ 2,000');
  });

  it('detecta montos mixtos y elimina duplicados', () => {
    const m = detectMontos('Hubo L 1,000 y también L 1,000 más USD 500.');
    expect(m).toEqual(['L 1,000', 'USD 500']);
  });

  it('retorna arreglo vacío si no hay montos', () => {
    expect(detectMontos('Informe sin cifras económicas.')).toEqual([]);
    expect(detectMontos(undefined)).toEqual([]);
    expect(detectMontos('')).toEqual([]);
  });

  it('no señala números que no son montos', () => {
    expect(detectMontos('Había 25 personas en la reunión el 05 de marzo de 2023.')).toEqual([]);
  });
});
