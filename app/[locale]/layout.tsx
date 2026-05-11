import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/a11y/skip-link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  display: "swap",
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: t("siteTitle"),
      template: `%s · ${t("siteTitleShort")}`,
    },
    description: t("defaultDescription"),
    keywords: t("keywords"),
    metadataBase: new URL("https://iciitp.com"),
    openGraph: {
      siteName: t("siteTitle"),
      locale,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <Nav />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer lastUpdated="2025-09-01" />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
