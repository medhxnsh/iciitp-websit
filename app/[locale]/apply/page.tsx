import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import { IncubationForm } from "@/components/forms/incubation-form";
import { LabAccessForm } from "@/components/forms/lab-access-form";
import { InternshipForm } from "@/components/forms/internship-form";

interface Props { params: Promise<{ locale: string; }>; searchParams: Promise<{ form?: string }> }

export const metadata: Metadata = {
  title: "Apply — IC IITP",
  description: "Apply for incubation, request lab access, or submit an internship application at IC IITP.",
};

const TABS = [
  { id: "incubation", label: "Incubation application" },
  { id: "lab-access", label: "Lab access request" },
  { id: "internship", label: "Internship application" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default async function ApplyPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { form } = await searchParams;
  setRequestLocale(locale);

  const active: TabId = (TABS.find((t) => t.id === form)?.id) ?? "incubation";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Apply" }]} />

      <header className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: "#3a5214" }}>Apply</h1>
        <p className="text-base" style={{ color: "#5a6644" }}>
          Choose the form that matches your request below.
        </p>
      </header>

      {/* Tab bar — uses server-side search param, no JS required for tab selection */}
      <nav className="flex gap-1 mb-8 rounded-xl p-1" style={{ backgroundColor: "#f0f7e6" }} aria-label="Application forms">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <a
              key={tab.id}
              href={`?form=${tab.id}`}
              className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              style={isActive
                ? { backgroundColor: "#3a5214", color: "white" }
                : { color: "#5a7c20" }
              }
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      {active === "incubation" && <IncubationForm locale={locale} />}
      {active === "lab-access" && <LabAccessForm locale={locale} />}
      {active === "internship" && <InternshipForm locale={locale} />}
    </div>
  );
}
