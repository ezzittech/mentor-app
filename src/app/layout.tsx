import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MasarMentors | مسار منتورز",
    template: "%s | MasarMentors",
  },
  description:
    "منصة الإرشاد والتطوير المهني المتكاملة — رحلتك في التطوير المهني تبدأ هنا",
  keywords: ["mentoring", "career development", "الإرشاد المهني", "التطوير المهني"],
  authors: [{ name: "MasarMentors Team" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "MasarMentors",
    title: "MasarMentors — منصة الإرشاد والتطوير المهني",
    description: "رحلتك في التطوير المهني تبدأ هنا",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansArabic.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
