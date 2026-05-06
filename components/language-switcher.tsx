"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("a11y");

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="relative flex items-center gap-1" role="navigation" aria-label={t("languageSwitcher")}>
      <Globe className="w-4 h-4 text-[--color-muted]" aria-hidden="true" />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          disabled={loc === locale}
          aria-current={loc === locale ? "true" : undefined}
          className="px-2 py-0.5 text-sm rounded-[--radius-sm] disabled:font-semibold disabled:text-[--color-primary] text-[--color-text-subtle] hover:text-[--color-text] transition-colors"
        >
          {loc === "en" ? "EN" : "हि"}
        </button>
      ))}
    </div>
  );
}
