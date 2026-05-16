import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { Link } from "@/i18n/navigation";
import {
  HelpCircle, Map, Bot, FileText,
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
    a: "Visit the Programs page and choose the scheme that fits your startup stage. Each program has an 'Apply Now' button that opens the relevant Google Form. Applications are reviewed on a rolling basis.",
  },
  {
    q: "Who can apply for NIDHI Prayas funding?",
    a: "NIDHI Prayas is open to early-stage tech startups with a working prototype. You must be DPIIT-recognised or willing to register. The grant is up to ₹10 lakh, non-dilutive.",
  },
  {
    q: "Can I visit the labs without being an incubatee?",
    a: "Lab access is primarily for IC IITP incubatees. External researchers and academic collaborators may request access by writing to icitp@iitp.ac.in.",
  },
  {
    q: "What is the DISHA AI assistant?",
    a: "DISHA is IC IITP's built-in AI assistant — click the 'Ask DISHA' button at the bottom-right of any page. It can answer questions about programs, eligibility, funding, labs, and how to apply. For complex queries, it will direct you to the relevant page or contact.",
  },
  {
    q: "How do I download application forms?",
    a: "All downloadable forms are on the Downloads page. PDFs open in a new tab. If a link is broken, please report it through the Feedback page or email icitp@iitp.ac.in.",
  },
  {
    q: "How do I report a website issue or broken link?",
    a: "Use the Feedback page or email icitp@iitp.ac.in with the page URL and a description of the issue. We aim to resolve reported issues within 10 working days.",
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
          Find your way around the IC IITP website — site map, frequently asked questions, the DISHA AI assistant, and contact details.
        </p>
      </header>

      {/* Quick jump */}
      <nav aria-label="Help sections" className="flex flex-wrap gap-2 mb-10">
        {["Site map", "FAQs", "DISHA assistant", "Contact"].map((label) => (
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

      {/* DISHA AI Assistant */}
      <section id="disha-assistant" aria-labelledby="disha-h" className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <Bot className="w-5 h-5" style={{ color: "#3a5214" }} aria-hidden="true" />
          <h2 id="disha-h" className="text-xl font-bold" style={{ color: "#1c2e06" }}>
            DISHA AI assistant
          </h2>
        </div>
        <div className="rounded-xl bg-white p-6" style={{ border: "1px solid #e8f0e0" }}>
          <p className="text-sm mb-4" style={{ color: "#5a6644" }}>
            <strong style={{ color: "#1c2e06" }}>DISHA</strong> (Digital Information &amp; Support Hub Assistant) is IC IITP&apos;s built-in AI guide. It&apos;s available on every page — look for the <strong style={{ color: "#1c2e06" }}>Ask DISHA</strong> button at the bottom-right corner.
          </p>
          <ul className="space-y-3 text-sm mb-5" style={{ color: "#5a6644" }}>
            <li className="flex gap-2"><span style={{ color: "#f79420" }}>›</span> Ask about any incubation program — eligibility, funding amounts, application process.</li>
            <li className="flex gap-2"><span style={{ color: "#f79420" }}>›</span> Get directions to the right page — labs, events, notifications, downloads.</li>
            <li className="flex gap-2"><span style={{ color: "#f79420" }}>›</span> Ask about BioNEST equipment access or lab booking.</li>
            <li className="flex gap-2"><span style={{ color: "#f79420" }}>›</span> Get contact details and office hours instantly.</li>
            <li className="flex gap-2"><span style={{ color: "#f79420" }}>›</span> Understand the difference between NIDHI Prayas, NIDHI-EIR, SISF, MEITY, and GENESIS schemes.</li>
          </ul>
          <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: "#f8fbf4", border: "1px solid #d4e6c4" }}>
            <p style={{ color: "#3a5214" }}>
              <strong>Tip:</strong> DISHA works best with specific questions like &ldquo;What is the grant amount for NIDHI Prayas?&rdquo; or &ldquo;How do I apply for BioNEST equipment access?&rdquo;
            </p>
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
