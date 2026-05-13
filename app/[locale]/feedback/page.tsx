import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { FeedbackForm } from "@/components/forms/feedback-form";
import { Clock } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.feedback" });
  return { title: t("title"), description: t("description") };
}

export default async function FeedbackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Feedback" }]} />

      <header className="mb-8">
        <h1 className="text-4xl font-black mb-3" style={{ color: "#3a5214" }}>
          Share your feedback
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "#5a6644" }}>
          Suggestions, complaints, compliments — we want to hear from you.
        </p>
      </header>

      <div
        className="rounded-2xl p-5 mb-8 flex gap-3"
        style={{ backgroundColor: "#f0f7e6", border: "1px solid #d4e6c4" }}
      >
        <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#3a5214" }} aria-hidden="true" />
        <p className="text-sm leading-relaxed" style={{ color: "#3a5214" }}>
          We acknowledge every submission within <strong>3 working days</strong> and respond fully within <strong>15 working days</strong>.
        </p>
      </div>

      <FeedbackForm locale={locale} />
    </div>
  );
}
