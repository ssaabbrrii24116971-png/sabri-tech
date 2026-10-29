import type { Metadata, Viewport } from "next";
import { Cairo, Inter, Sora } from "next/font/google";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { DemoBanner, TopBar } from "@/components/layout/TopBar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { siteConfig } from "@/config/site";
import { dir } from "@/i18n";
import { pixelId } from "@/lib/meta-pixel";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["600", "700", "800"], display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} – ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: siteConfig.name, locale: siteConfig.locale === "ar" ? "ar_TN" : "fr_TN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#080F20" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isAr = siteConfig.locale === "ar";
  return (
    <html
      lang={siteConfig.locale}
      dir={dir}
      className={`${inter.variable} ${sora.variable} ${cairo.variable}`}
      style={
        {
          "--font-sans": isAr ? "var(--font-arabic)" : "var(--font-latin)",
          "--font-display": isAr ? "var(--font-arabic)" : "var(--font-sora)",
        } as React.CSSProperties
      }
    >
      <body>
        <MetaPixel />
        {pixelId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
          </noscript>
        )}
        <TopBar />
        <Header />
        <DemoBanner />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
