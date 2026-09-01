import type { Metadata } from "next";
import ChatWidget from "@/components/chat/ChatWidget";
import SiteHeader from "@/components/navigation/SiteHeader";
import { ThemeProvider } from "@/components/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corrupción Honduras",
  description:
    "Portal para mapear, documentar y visibilizar el daño social de la corrupción en Honduras. Dirigido a ciudadanía, periodistas y activistas.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
          >
            Saltar al contenido principal
          </a>
          <SiteHeader />
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
