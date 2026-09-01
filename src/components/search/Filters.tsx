'use client';

export interface FilterState {
  status?: string;
  tipo?: string;
  monto_min?: string;
  monto_max?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'abierto', label: 'Abierto' },
  { value: 'investigacion', label: 'En investigación' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'archivado', label: 'Archivado' },
];

const TIPO_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'persona', label: 'Persona' },
  { value: 'empresa', label: 'Empresa' },
  { value: 'institucion', label: 'Institución' },
  { value: 'organismo', label: 'Organismo' },
];

export default function Filters({ filters, onChange }: FiltersProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const clearAll = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-status" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Estado
        </label>
        <select
          id="filter-status"
          value={filters.status || ''}
          onChange={(e) => update('status', e.target.value)}
          className="select-base"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-tipo" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Tipo
        </label>
        <select
          id="filter-tipo"
          value={filters.tipo || ''}
          onChange={(e) => update('tipo', e.target.value)}
          className="select-base"
        >
          {TIPO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-monto-min" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Monto min (L.)
        </label>
        <input
          id="filter-monto-min"
          type="number"
          value={filters.monto_min || ''}
          onChange={(e) => update('monto_min', e.target.value)}
          placeholder="Monto min"
          className="input-base w-32"
        />
      </div>

      <div>
        <label htmlFor="filter-monto-max" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Monto max (L.)
        </label>
        <input
          id="filter-monto-max"
          type="number"
          value={filters.monto_max || ''}
          onChange={(e) => update('monto_max', e.target.value)}
          placeholder="Monto max"
          className="input-base w-32"
        />
      </div>

      <div>
        <label htmlFor="filter-fecha-desde" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Desde
        </label>
        <input
          id="filter-fecha-desde"
          type="date"
          value={filters.fecha_desde || ''}
          onChange={(e) => update('fecha_desde', e.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <label htmlFor="filter-fecha-hasta" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Hasta
        </label>
        <input
          id="filter-fecha-hasta"
          type="date"
          value={filters.fecha_hasta || ''}
          onChange={(e) => update('fecha_hasta', e.target.value)}
          className="input-base"
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
