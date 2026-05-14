import { requireAuth } from "@/lib/auth";
import { getPageSection } from "@/lib/cms/page-sections";
import { saveHomeSectionAction } from "../actions";
import { HomeSectionForm } from "@/components/admin/home-section-form";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export const metadata = { title: "Edit Home — IC IITP Admin" };

const DEFAULT_STATS = [
  { value: "₹47.10 Cr", label: "Total Undertaking" },
  { value: "100+",      label: "Startups Supported" },
  { value: "1,000+",    label: "B-Plans Screened" },
  { value: "25",        label: "Patents Facilitated" },
  { value: "600+",      label: "Funding Transactions" },
  { value: "6",         label: "Incubation Schemes" },
];

const DEFAULTS = {
  about_headline:       "Built at IIT Patna.\nBuilt for India.",
  about_body_1:         "IC IITP is a Government of India & Bihar joint initiative (Reg. No. 987, 2015–16) seated on a 500+ acre campus in Bihta, Patna. Our mission: make ESDM and healthcare technology accessible to the common man.",
  about_body_2:         "Since inception we have screened 1,000+ business plans, facilitated 25 patent filings, and deployed seed capital across 600+ funding transactions.",
  cta_headline:         "Build the future\nwith IC IITP",
  cta_body:             "Apply for incubation, request lab access, or reach out to our team. We support deep-tech founders from idea to market.",
  building_image_url:   "",
  team_staff_image_url: "",
  team_group_image_url: "",
  stats:                DEFAULT_STATS,
};

export default async function HomeEditorPage() {
  await requireAuth();
  const cms = await getPageSection("home").catch(() => null);

  const current = {
    about_headline:       cms?.about_headline       || DEFAULTS.about_headline,
    about_body_1:         cms?.about_body_1         || DEFAULTS.about_body_1,
    about_body_2:         cms?.about_body_2         || DEFAULTS.about_body_2,
    cta_headline:         cms?.cta_headline         || DEFAULTS.cta_headline,
    cta_body:             cms?.cta_body             || DEFAULTS.cta_body,
    building_image_url:   cms?.building_image_url   || DEFAULTS.building_image_url,
    team_staff_image_url: cms?.team_staff_image_url || DEFAULTS.team_staff_image_url,
    team_group_image_url: cms?.team_group_image_url || DEFAULTS.team_group_image_url,
    stats:                (cms?.stats && cms.stats.length > 0) ? cms.stats : DEFAULTS.stats,
  };

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/pages" className="text-sm" style={{ color: "#7a8e6a" }}>← Pages</Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <LayoutDashboard className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black" style={{ color: "#1c2e06" }}>Edit Home Page</h1>
      </div>
      <p className="text-sm mb-6" style={{ color: "#7a8e6a" }}>
        Changes appear live on <a href="/en" target="_blank" className="underline">the homepage</a>.
        Leave an image field blank to use the default site image.
      </p>
      <HomeSectionForm current={current} onSave={saveHomeSectionAction} />
    </main>
  );
}
