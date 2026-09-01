import {
  allCasosRed,
  allActoresRed,
  allConexionesRed,
  getActoresByCaso,
  getConexionesByCaso,
  getCasoRed,
} from '../index';

const casosNuevos = ['praf', 'rosa-de-lobo'];

describe('redes / catálogo de casos emblemáticos', () => {
  it('incluye los 5 casos emblemáticos del catálogo', () => {
    const ids = allCasosRed.map((c) => c.id);
    expect(ids).toContain('ihss-desfalco');
    expect(ids).toContain('hospitales-moviles');
    expect(ids).toContain('caso-pandora');
    expect(ids).toContain('praf');
    expect(ids).toContain('rosa-de-lobo');
    expect(allCasosRed.length).toBeGreaterThanOrEqual(5);
  });

  it('cada actor nuevo pertenece a un caso existente y tiene datos esenciales', () => {
    for (const casoId of casosNuevos) {
      const actores = getActoresByCaso(casoId);
      expect(actores.length).toBeGreaterThan(0);
      for (const actor of actores) {
        expect(actor.caso_id).toBe(casoId);
        expect(actor.status_legal).toBeDefined();
        expect(actor.nombre.length).toBeGreaterThan(0);
      }
    }
  });

  it('cada conexión nueva referencia actores existentes del mismo caso', () => {
    for (const casoId of casosNuevos) {
      const actores = getActoresByCaso(casoId);
      const ids = new Set(actores.map((a) => a.id));
      const conexiones = getConexionesByCaso(casoId);
      expect(conexiones.length).toBeGreaterThan(0);
      for (const conn of conexiones) {
        expect(conn.caso_id).toBe(casoId);
        expect(ids.has(conn.actor_origen_id)).toBe(true);
        expect(ids.has(conn.actor_destino_id)).toBe(true);
        expect(conn.tipo.length).toBeGreaterThan(0);
      }
    }
  });

  it('los casos PRAF y Rosa de Lobo tienen fuentes verificables', () => {
    const praf = getCasoRed('praf');
    expect(praf?.fuente_url).toMatch(/https:\/\//);
    expect(praf?.monto).toBeGreaterThan(0);

    const rosa = getCasoRed('rosa-de-lobo');
    expect(rosa?.fuente_url).toMatch(/https:\/\//);
    expect(rosa?.monto).toBeGreaterThan(0);
  });

  it('los datos agregados son consistentes en conteos', () => {
    const totalActores = allActoresRed.length;
    const totalConexiones = allConexionesRed.length;
    expect(totalActores).toBeGreaterThan(0);
    expect(totalConexiones).toBeGreaterThan(0);
    // Cada conexión debe apuntar a un actor existente en el catálogo global
    const actorIds = new Set(allActoresRed.map((a) => a.id));
    for (const conn of allConexionesRed) {
      expect(actorIds.has(conn.actor_origen_id)).toBe(true);
      expect(actorIds.has(conn.actor_destino_id)).toBe(true);
    }
    void totalActores;
    void totalConexiones;
  });
});
