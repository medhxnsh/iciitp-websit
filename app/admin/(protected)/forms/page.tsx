import { requireAuth } from "@/lib/auth";
import { getAllFormLinks } from "@/lib/cms/form-links";
import { FORMS } from "@/lib/forms";
import { FormLinksClient } from "./_client";
import { Link2 } from "lucide-react";

export const metadata = { title: "Form Links — IC IITP Admin" };
export const dynamic = "force-dynamic";

export default async function FormLinksPage() {
  await requireAuth();
  const cmsLinks = await getAllFormLinks();
  const cmsMap = new Map(cmsLinks.map((l) => [l.key, l]));

  // Merge static FORMS with CMS overrides
  const entries = Object.entries(FORMS).map(([key, staticEntry]) => {
    const cms = cmsMap.get(key);
    return {
      key,
      label: staticEntry.label,
      url: cms?.url ?? staticEntry.url,
      active: cms?.active ?? true,
      customised: !!cms,
    };
  });

  return (
    <main className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-4">
        <Link2 className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Form Links</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#7a8e6a" }}>
        Update the Google Form or application URLs used across the website. Changes are instant — no redeployment needed.
      </p>
      <FormLinksClient entries={entries} />
    </main>
  );
}
