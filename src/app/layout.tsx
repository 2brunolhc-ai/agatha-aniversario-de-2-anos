import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ágatha 2 aninhos | Confirmação de presença",
  description: "Confirme sua presença na comemoração dos 2 aninhos da Ágatha, no domingo, 26 de julho de 2026, às 12:00.",
  applicationName: "Ágatha 2 aninhos",
  authors: [{ name: "Família da Ágatha" }],
  keywords: ["Ágatha", "2 aninhos", "aniversário", "confirmação de presença", "26 de julho de 2026"],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Ágatha 2 aninhos",
    title: "Ágatha faz 2!",
    description: "Confirme sua presença na comemoração dos 2 aninhos da Ágatha, no domingo, 26 de julho de 2026, às 12:00.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ágatha faz 2!",
    description: "Domingo, 26 de julho de 2026, às 12:00. Confirme sua presença para esta celebração tão especial.",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#CBB7E9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
