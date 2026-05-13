import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { Link } from "@/i18n/navigation";
import {
  HelpCircle, Map, Accessibility, FileText,
  Phone, Globe, ChevronDown,
} from "lucide-react";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.help" });
  return { title: t("title"), description: t("description") };
}

const SITE_MAP = [
  {
    section: "About IC IITP",
    links: [
      { label: "Overview", href: "/about" },
      { label: "Governing Society", href: "/about/governance" },
      { label: "Evaluation Team", href: "/about/evaluation-team" },
      { label: "Staff", href: "/about/staff" },
    ],
  },
  {
    section: "Programs",
    links: [
      { label: "All programs", href: "/programs" },
      { label: "Flagship Incubation", href: "/programs/icitp-incubation" },
      { label: "NIDHI Prayas", href: "/programs/nidhi-prayas" },
      { label: "NIDHI-EIR", href: "/programs/nidhi-eir" },
      { label: "SISF", href: "/programs/sisf" },
      { label: "BiONEST", href: "/programs/bionest" },
      { label: "GENESIS", href: "/programs/genesis" },
    ],
  },
  {
    section: "Portfolio",
    links: [
      { label: "All startups", href: "/portfolio" },
      { label: "MeitY scheme", href: "/portfolio/meity" },
      { label: "SISF scheme", href: "/portfolio/sisf" },
      { label: "NIDHI Prayas", href: "/portfolio/nidhi-prayas" },
      { label: "NIDHI-EIR", href: "/portfolio/nidhi-eir" },
      { label: "GENESIS", href: "/portfolio/genesis" },
    ],
  },
  {
    section: "Facilities",
    links: [
      { label: "All labs", href: "/facilities" },
      { label: "Clean Room", href: "/facilities/clean-room" },
      { label: "PCB Fabrication", href: "/facilities/pcb-fab" },
      { label: "ESDM", href: "/facilities/esdm" },
      { label: "Design & Simulation", href: "/facilities/design-sim" },
      { label: "Mechanical & Packaging", href: "/facilities/mech-packaging" },
      { label: "Testing & Calibration", href: "/facilities/test-cal" },
    ],
  },
  {
    section: "Events & Notifications",
    links: [
      { label: "Events", href: "/events" },
      { label: "Notifications", href: "/notifications" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    section: "Other",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Feedback", href: "/feedback" },
      { label: "Search", href: "/search" },
      { label: "Policies", href: "/policies/accessibility" },
    ],
  },
];

const FAQS = [
  {
    q: "How do I apply for incubation?",
    a: "Visit the Programs page and choose the scheme that fits your startup stage. Each program has an 'Apply Now' button that opens the relevant Google Form. Applications are reviewed quarterly.",
  },
  {
    q: "Who can apply for NIDHI Prayas funding?",
    a: "NIDHI Prayas is open to early-stage tech startups with a working prototype. You must be DPIIT-recognised or willing to register. The grant is up to ₹10 lakh, non-dilutive.",
  },
  {
    q: "Can I visit the labs without being an incubatee?",
    a: "Lab access is primarily for IC IITP incubatees. External researchers and academic collaborators may request access via the Contact page by writing to icitp@iitp.ac.in.",
  },
  {
    q: "The site is not readable with my screen reader. What should I do?",
    a: "We follow GIGW accessibility guidelines. If you encounter a barrier, email icitp@iitp.ac.in with 'Accessibility issue' in the subject — we aim to fix reported issues within 15 working days.",
  },
  {
    q: "How do I download application forms?",
    a: "All downloadable forms are on the Downloads page. PDFs open in a new tab. If a link is broken, please report it through the Feedback page.",
  },
  {
    q: "The site is available in Hindi. How do I switch?",
    a: "Use the language switcher in the top navigation bar (EN / हि). The switch applies to the full site immediately.",
  },
];

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Help" }]} />

      <header className="mb-10">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
          style={{ backgroundColor: "#f0f7e6" }}
          aria-hidden="true"
        >
          <HelpCircle className="w-6 h-6" style={{ color: "#3a5214" }} />
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#3a5214" }}>
          Help & site guide
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "#5a6644" }}>
          Find your way around the IC IITP website — site map, FAQs, accessibility information, and contact details.
        </p>
      </header>

      {/* Quick jump */}
      <nav aria-label="Help sections" className="flex flex-wrap gap-2 mb-10">
        {["Site map", "FAQs", "Accessibility", "Contact"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: "#f0f7e6", color: "#3a5214", border: "1px solid #d4e6c4" }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Site map */}
      <section id="site-map" aria-labelledby="sitemap-h" className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <Map className="w-5 h-5" style={{ color: "#3a5214" }} aria-hidden="true" />
          <h2 id="sitemap-h" className="text-xl font-bold" style={{ color: "#1c2e06" }}>
            Site map
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SITE_MAP.map(({ section, links }) => (
            <div
              key={section}
              className="rounded-xl p-4 bg-white"
              style={{ border: "1px solid #e8f0e0" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#5a7c20" }}>
                {section}
              </p>
              <ul className="space-y-1.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm hover:underline"
                      style={{ color: "#3a5214" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" aria-labelledby="faq-h" className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <HelpCircle className="w-5 h-5" style={{ color: "#3a5214" }} aria-hidden="true" />
          <h2 id="faq-h" className="text-xl font-bold" style={{ color: "#1c2e06" }}>
            Frequently asked questions
          </h2>
        </div>
        <dl className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl bg-white overflow-hidden group"
              style={{ border: "1px solid #e8f0e0" }}
            >
              <summary
                className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-sm font-semibold list-none"
                style={{ color: "#1c2e06" }}
              >
                <dt>{q}</dt>
                <ChevronDown
                  className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                  style={{ color: "#5a7c20" }}
                  aria-hidden="true"
                />
              </summary>
              <dd
                className="px-5 pb-4 text-sm leading-relaxed"
                style={{ color: "#5a6644", borderTop: "1px solid #f0f7e6" }}
              >
                <div className="pt-3">{a}</div>
              </dd>
            </details>
          ))}
        </dl>
      </section>

      {/* Accessibility */}
      <section id="accessibility" aria-labelledby="a11y-h" className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <Accessibility className="w-5 h-5" style={{ color: "#3a5214" }} aria-hidden="true" />
          <h2 id="a11y-h" className="text-xl font-bold" style={{ color: "#1c2e06" }}>
            Accessibility
          </h2>
        </div>
        <div className="rounded-xl bg-white p-6" style={{ border: "1px solid #e8f0e0" }}>
          <ul className="space-y-3 text-sm" style={{ color: "#5a6644" }}>
            <li>This site follows <strong style={{ color: "#1c2e06" }}>GIGW (Guidelines for Indian Government Websites)</strong> and aims for WCAG 2.1 AA compliance.</li>
            <li>All images have descriptive alt text. Decorative images are marked <code>aria-hidden</code>.</li>
            <li>A <strong style={{ color: "#1c2e06" }}>skip to content</strong> link is available at the top of every page — press Tab on keyboard to reveal it.</li>
            <li>The site is fully navigable by keyboard. Focus indicators are visible on all interactive elements.</li>
            <li>Colour contrast ratios meet WCAG AA on all text combinations.</li>
            <li>External links open a confirmation dialog before navigating away from the site.</li>
            <li>The site is available in <strong style={{ color: "#1c2e06" }}>English and Hindi</strong>. Use the language switcher (EN / हि) in the top navigation.</li>
            <li>
              To report an accessibility barrier, email{" "}
              <a href="mailto:icitp@iitp.ac.in?subject=Accessibility%20issue" style={{ color: "#3a5214" }} className="hover:underline">
                icitp@iitp.ac.in
              </a>{" "}
              with <em>"Accessibility issue"</em> in the subject. We aim to respond within 15 working days.
            </li>
          </ul>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #e8f0e0" }}>
            <Link href="/policies/accessibility" className="text-sm font-medium hover:underline" style={{ color: "#3a5214" }}>
              Read the full Accessibility Statement →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-h">
        <div className="flex items-center gap-3 mb-5">
          <Phone className="w-5 h-5" style={{ color: "#3a5214" }} aria-hidden="true" />
          <h2 id="contact-h" className="text-xl font-bold" style={{ color: "#1c2e06" }}>
            Contact & support
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91 611 523 3547", href: "tel:+916115233547" },
            { icon: <Globe className="w-5 h-5" />, label: "Email", value: "icitp@iitp.ac.in", href: "mailto:icitp@iitp.ac.in" },
            { icon: <FileText className="w-5 h-5" />, label: "Feedback form", value: "Share your thoughts", href: "/feedback" },
          ].map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-start gap-3 rounded-xl p-4 bg-white transition-shadow hover:shadow-sm"
              style={{ border: "1px solid #e8f0e0" }}
            >
              <span className="mt-0.5 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true">{icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#5a7c20" }}>{label}</p>
                <p className="text-sm font-medium" style={{ color: "#1c2e06" }}>{value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
