'use client';

import { AdminPanel } from '@/components/admin';

export default function AdminPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[#f5f3ec] dark:bg-[#121316] transition-colors py-8 sm:py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl border-b-2 border-[#1c1917] pb-4 dark:border-[#3f3f46]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b91c1c] dark:text-[#f87171] block mb-1">
            [ PANEL DE ADMINISTRACIÓN ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#1c1917] dark:text-[#f4f4f5] sm:text-4xl">
            Edición de Redes
          </h1>
          <p className="mt-2 text-sm font-mono text-[#57534e] dark:text-[#a1a1aa]">
            Registra, edita y relaciona los actores, empresas y flujos de cada caso emblemático. Los cambios se reflejan de inmediato en la visualización pública.
          </p>
        </div>
        <AdminPanel />
      </section>
    </main>
  );
}
