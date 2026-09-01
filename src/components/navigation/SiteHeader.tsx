'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme';

const navigationItems = [
  { href: '/', label: 'Explorar Datos' },
  { href: '/kpis', label: 'Perjuicio Social' },
  { href: '/redes', label: 'Redes de Casos' },
  { href: '/admin', label: 'Administrar' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-[#1c1917] bg-[#fdfcf9] dark:border-[#3f3f46] dark:bg-[#15161c] transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border-2 border-[#1c1917] bg-[#b91c1c] text-xs font-mono font-bold text-white shadow-retro-sm dark:border-[#f4f4f5] dark:shadow-none">
              HN
            </span>
            <div className="flex flex-col">
              <span className="text-base font-black uppercase tracking-wider text-[#1c1917] dark:text-[#f4f4f5] group-hover:underline">
                Corrupción Honduras
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#78716c] dark:text-[#a1a1aa]">
                [ Archivo Cívico y Redes ]
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Navegación principal">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-2 ${
                    isActive
                      ? 'border-[#1c1917] bg-[#1c1917] text-[#f5f3ec] shadow-retro-sm dark:border-[#f4f4f5] dark:bg-[#f4f4f5] dark:text-[#121316] dark:shadow-none'
                      : 'border-transparent text-[#57534e] hover:border-[#1c1917] hover:bg-[#f5f3ec] hover:text-[#1c1917] dark:text-[#a1a1aa] dark:hover:border-[#71717a] dark:hover:bg-[#242730] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-l-2 border-[#1c1917] pl-3 dark:border-[#3f3f46]">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}