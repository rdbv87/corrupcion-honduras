'use client';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  emptyMessage,
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{emptyMessage || 'No se encontraron resultados'}</p>
      </div>
    );
  }

  const getCellValue = (item: T, key: string): string => {
    const val = (item as Record<string, unknown>)[key];
    if (val == null) return '-';
    if (val instanceof Date) return val.toLocaleDateString('es-HN');
    return String(val);
  };

  return (
    <div className="overflow-x-auto border-2 border-[#1c1917] dark:border-[#3f3f46]">
      <table className="min-w-full divide-y-2 divide-[#1c1917] dark:divide-[#3f3f46]">
        <thead className="bg-[#faf8f2] dark:bg-[#1a1c22]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-mono font-bold text-[#1c1917] dark:text-[#f4f4f5] uppercase tracking-wider border-r last:border-r-0 border-[#1c1917]/20 dark:border-[#3f3f46]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#15161c] divide-y border-t-2 border-[#1c1917] divide-[#1c1917]/20 dark:divide-[#3f3f46] dark:border-[#3f3f46]">
          {data.map((item, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-[#f5f3ec] dark:hover:bg-[#242730] transition-colors' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5 text-xs font-mono text-[#1c1917] dark:text-[#d4d4d8] whitespace-nowrap border-r last:border-r-0 border-[#1c1917]/20 dark:border-[#3f3f46]">
                  {col.render
                    ? col.render(item)
                    : String(getCellValue(item, col.key) ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
