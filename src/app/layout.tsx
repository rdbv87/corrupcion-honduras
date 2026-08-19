import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corrupción Honduras",
  description:
    "Portal para mapear, documentar y visibilizar el daño social de la corrupción en Honduras. Dirigido a ciudadanía, periodistas y activistas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
