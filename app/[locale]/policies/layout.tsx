import { setRequestLocale } from "next-intl/server";

interface PoliciesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PoliciesLayout({ children, params }: PoliciesLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </div>
  );
}
