import {
  getCasosRed,
  createCasoRed,
  updateCasoRed,
  deleteCasoRed,
  getActoresByCaso,
  createActorRed,
  updateActorRed,
  deleteActorRed,
  createConexionRed,
  updateConexionRed,
  deleteConexionRed,
  getConexionesByCaso,
} from '../redesStore';

describe('redesStore', () => {
  const seedCasoId = 'ihss-desfalco';

  it('se siembra con los casos emblemáticos existentes', () => {
    const casos = getCasosRed();
    expect(casos.length).toBeGreaterThanOrEqual(3);
    expect(getCasosRed().some((c) => c.id === seedCasoId)).toBe(true);
  });

  describe('CasoRed', () => {
    it('crea, actualiza y elimina un caso', () => {
      const creado = createCasoRed({
        titulo: 'Caso de Prueba',
        subtitulo: 'Subtítulo de prueba',
        periodo: '2020–2021',
        monto: 1000000,
        moneda: 'HNL',
        monto_usd: 40000,
        descripcion_corta: 'Descripción',
        fuente_principal: 'Fuente',
        fuente_url: 'https://example.com',
        status_judicial: 'En investigación',
      });
      expect(creado.id).toBeTruthy();
      expect(getCasosRed().some((c) => c.id === creado.id)).toBe(true);

      const actualizado = updateCasoRed(creado.id, { titulo: 'Caso Renombrado' });
      expect(actualizado?.titulo).toBe('Caso Renombrado');

      expect(deleteCasoRed(creado.id)).toBe(true);
      expect(getCasosRed().some((c) => c.id === creado.id)).toBe(false);
    });

    it('devuelve undefined al actualizar/eliminar un caso inexistente', () => {
      expect(updateCasoRed('no-existe', {})).toBeUndefined();
      expect(deleteCasoRed('no-existe')).toBe(false);
    });
  });

  describe('ActorRed', () => {
    it('crea un actor dentro del caso y lo liga correctamente', () => {
      const actor = createActorRed({
        caso_id: seedCasoId,
        nombre: 'Actor Prueba',
        tipo_actor: 'funcionario',
        rol: 'Rol',
        status_legal: 'investigado',
      });
      expect(getActoresByCaso(seedCasoId).some((a) => a.id === actor.id)).toBe(true);
      expect(deleteActorRed(actor.id)).toBe(true);
    });

    it('al eliminar un actor se eliminan sus conexiones (cascada)', () => {
      const a = createActorRed({ caso_id: seedCasoId, nombre: 'A', tipo_actor: 'funcionario', rol: '', status_legal: 'investigado' });
      const b = createActorRed({ caso_id: seedCasoId, nombre: 'B', tipo_actor: 'empresa', rol: '', status_legal: 'investigado' });
      const conexion = createConexionRed({
        caso_id: seedCasoId,
        actor_origen_id: a.id,
        actor_destino_id: b.id,
        tipo: 'financiero',
        descripcion: 'Vínculo',
        periodo: '2020',
      });
      expect(conexion).not.toBeNull();

      expect(deleteActorRed(a.id)).toBe(true);
      expect(getConexionesByCaso(seedCasoId).some((c) => c.id === conexion?.id)).toBe(false);
      expect(deleteActorRed(b.id)).toBe(true);
    });

    it('actualiza un actor', () => {
      const a = createActorRed({ caso_id: seedCasoId, nombre: 'A', tipo_actor: 'empresa', rol: '', status_legal: 'investigado' });
      const updated = updateActorRed(a.id, { status_legal: 'procesado' });
      expect(updated?.status_legal).toBe('procesado');
      expect(deleteActorRed(a.id)).toBe(true);
    });
  });

  describe('ConexionRed', () => {
    it('rechaza conexión entre actores inexistentes o de otros casos', () => {
      const creada = createConexionRed({
        caso_id: seedCasoId,
        actor_origen_id: 'id-inexistente',
        actor_destino_id: 'otro-inexistente',
        tipo: 'financiero',
        descripcion: 'Inválida',
        periodo: '2020',
      });
      expect(creada).toBeNull();
    });

    it('crea, actualiza y elimina una conexión válida', () => {
      const a = createActorRed({ caso_id: seedCasoId, nombre: 'X', tipo_actor: 'funcionario', rol: '', status_legal: 'investigado' });
      const b = createActorRed({ caso_id: seedCasoId, nombre: 'Y', tipo_actor: 'empresa', rol: '', status_legal: 'investigado' });
      const conexion = createConexionRed({
        caso_id: seedCasoId,
        actor_origen_id: a.id,
        actor_destino_id: b.id,
        tipo: 'financiero',
        descripcion: 'Vínculo',
        periodo: '2020',
        monto: 50000,
      });
      expect(conexion).not.toBeNull();

      const updated = updateConexionRed(conexion!.id, { descripcion: 'Vínculo actualizado' });
      expect(updated?.descripcion).toBe('Vínculo actualizado');

      expect(deleteConexionRed(conexion!.id)).toBe(true);
      expect(deleteActorRed(a.id)).toBe(true);
      expect(deleteActorRed(b.id)).toBe(true);
    });

    it('devuelve null al actualizar una conexión inexistente', () => {
      expect(updateConexionRed('no-existe', {})).toBeNull();
    });
  });
});
