import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PolicyStub } from "@/lib/policy-stub";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.policies.security" });
  return { title: t("title"), description: t("description") };
}

export default async function PolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.policies.security");
  return <PolicyStub title={t("title")} description={t("description")} />;
}
