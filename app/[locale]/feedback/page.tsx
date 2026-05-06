import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { ExternalLink } from "@/components/external-link";
import { FORMS } from "@/lib/forms";
import { MessageSquare, Mail, Clock, CheckCircle } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.feedback" });
  return { title: t("title"), description: t("description") };
}

export default async function FeedbackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hasFeedbackForm = Boolean(FORMS.feedback);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Feedback" }]} />

      <header className="mb-10">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
          style={{ backgroundColor: "#f0f7e6" }}
          aria-hidden="true"
        >
          <MessageSquare className="w-6 h-6" style={{ color: "#3a5214" }} />
        </div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#3a5214" }}>
          Share your feedback
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "#5a6644" }}>
          Your experience helps us improve. Whether it&apos;s a suggestion, a complaint, or
          a compliment — we want to hear from you.
        </p>
        <div className="mt-4">
          <LastUpdatedBadge date="2025-09-01" />
        </div>
      </header>

      {/* SLA commitment */}
      <div
        className="rounded-2xl p-6 mb-8 flex gap-4"
        style={{ backgroundColor: "#f0f7e6", border: "1px solid #d4e6c4" }}
      >
        <Clock className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true" />
        <div>
          <p className="font-semibold mb-0.5" style={{ color: "#1c2e06" }}>Our commitment</p>
          <p className="text-sm leading-relaxed" style={{ color: "#3a5214" }}>
            We acknowledge every feedback submission within <strong>3 working days</strong> and
            aim to resolve or respond fully within <strong>15 working days</strong>.
          </p>
        </div>
      </div>

      {/* Primary CTA — Google Form */}
      {hasFeedbackForm ? (
        <div className="mb-8">
          <ExternalLink
            href={FORMS.feedback}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#3a5214" } as React.CSSProperties}
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            Open feedback form
          </ExternalLink>
          <p className="text-xs mt-2" style={{ color: "#7a8e6a" }}>
            Opens in a new tab — Google Form, no login required.
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: "#fff8f0", border: "1px solid #fde8c8" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "#92400e" }}>
            Online form coming soon
          </p>
          <p className="text-sm" style={{ color: "#78350f" }}>
            Until the feedback form is ready, please reach out by email or phone.
          </p>
        </div>
      )}

      {/* Alternate contact methods */}
      <section aria-labelledby="contact-alt-h" className="mb-10">
        <h2 id="contact-alt-h" className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#5a7c20" }}>
          Other ways to reach us
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="mailto:icitp@iitp.ac.in?subject=Feedback"
            className="flex items-start gap-3 p-4 rounded-xl bg-white transition-shadow hover:shadow-sm"
            style={{ border: "1px solid #e8f0e0" }}
          >
            <Mail className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>Email</p>
              <p className="text-xs mt-0.5" style={{ color: "#3a5214" }}>icitp@iitp.ac.in</p>
              <p className="text-xs mt-1" style={{ color: "#7a8e6a" }}>Include "Feedback" in the subject line</p>
            </div>
          </a>
          <a
            href="tel:+916115233547"
            className="flex items-start gap-3 p-4 rounded-xl bg-white transition-shadow hover:shadow-sm"
            style={{ border: "1px solid #e8f0e0" }}
          >
            <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>Phone</p>
              <p className="text-xs mt-0.5" style={{ color: "#3a5214" }}>+91 611 523 3547</p>
              <p className="text-xs mt-1" style={{ color: "#7a8e6a" }}>Monday–Friday, 9 AM–5:30 PM IST</p>
            </div>
          </a>
        </div>
      </section>

      {/* What happens next */}
      <section aria-labelledby="next-h">
        <h2 id="next-h" className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#5a7c20" }}>
          What happens next
        </h2>
        <ol className="space-y-3">
          {[
            ["Acknowledgement", "You receive a confirmation within 3 working days."],
            ["Review", "Your feedback is reviewed by the IC IITP team."],
            ["Action or response", "We respond with our findings or actions taken within 15 working days."],
          ].map(([title, desc], i) => (
            <li key={title} className="flex gap-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 text-white"
                style={{ backgroundColor: "#3a5214" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1c2e06" }}>{title}</p>
                <p className="text-sm" style={{ color: "#5a6644" }}>{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
