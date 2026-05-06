import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "./external-link";
import { LastUpdatedBadge } from "./last-updated-badge";
import Image from "next/image";

interface FooterProps {
  lastUpdated?: string;
}

export function Footer({ lastUpdated }: FooterProps) {
  const t = useTranslations("footer");
  const tp = useTranslations("footer_policies");
  const tn = useTranslations("nav");

  return (
    <footer className="text-white no-print" style={{ backgroundColor: "#2a3a0d" }} role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="IC IIT Patna"
              width={52}
              height={52}
              className="rounded-full shrink-0"
            />
            <span className="text-sm font-medium text-white/70 leading-tight">
              IIT Patna<br />Incubation Centre
            </span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {t("tagline")}
          </p>
          <p className="text-xs text-white/50 leading-relaxed">
            {t("address")}
          </p>
          <p className="text-xs text-white/50 mt-1">
            ☎ {t("phone")}
          </p>
          <p className="text-xs text-white/50">
            ✉{" "}
            <a
              href={`mailto:${t("email")}`}
              className="hover:text-white transition-colors"
            >
              {t("email")}
            </a>
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
            {t("links")}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/", tn("home")],
              ["/about", tn("about")],
              ["/programs", tn("programs")],
              ["/portfolio", tn("portfolio")],
              ["/facilities", tn("facilities")],
              ["/events", tn("events")],
              ["/notifications", tn("notifications")],
              ["/contact", tn("contact")],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
            {t("policies")}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {[
              ["/policies/privacy", tp("privacy")],
              ["/policies/terms", tp("terms")],
              ["/policies/copyright", tp("copyright")],
              ["/policies/hyperlinking", tp("hyperlinking")],
              ["/policies/security", tp("security")],
              ["/policies/accessibility", tp("accessibility")],
              ["/sitemap", tp("sitemap")],
              ["/help", tn("help")],
              ["/downloads", tn("downloads")],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social + WIM */}
        <div>
          <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
            {t("social")}
          </h3>
          <div className="flex gap-3 mb-6">
            <ExternalLink
              href="https://in.linkedin.com/company/ic-iitp"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              <span className="sr-only">LinkedIn</span>
            </ExternalLink>
            <ExternalLink
              href="https://x.com/iciitp"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span className="sr-only">X / Twitter</span>
            </ExternalLink>
            <ExternalLink
              href="https://www.facebook.com/iciitp/"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="sr-only">Facebook</span>
            </ExternalLink>
          </div>

          <div className="text-xs text-white/50">
            <p className="font-semibold text-white/70 mb-1">{t("wim")}</p>
            <a
              href={`mailto:${t("wimContact")}`}
              className="hover:text-white transition-colors"
            >
              {t("wimContact")}
            </a>
          </div>

          <div className="mt-4 text-xs text-white/50">
            <ExternalLink
              href="https://india.gov.in"
              className="hover:text-white transition-colors"
            >
              {t("nationalPortal")}
            </ExternalLink>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>{t("ownership")} · © {new Date().getFullYear()}</p>
          {lastUpdated && <LastUpdatedBadge date={lastUpdated} />}
        </div>
      </div>
    </footer>
  );
}
