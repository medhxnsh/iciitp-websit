import { requireAuth } from "@/lib/auth";
import { SiteMapTree } from "@/components/admin/site-map-card";
import { Map } from "lucide-react";

export const metadata = { title: "Site Map — IC IITP Admin" };

const TREE = [
  {
    title: "Home",
    path: "/en",
    editHref: "/admin/pages/home",
  },
  {
    title: "Programs",
    path: "/en/programs",
    editHref: "/admin/content/programs",
    children: [
      { title: "ICITP Incubation", path: "/en/programs/icitp-incubation", editHref: "/admin/content/programs/icitp-incubation" },
      { title: "NIDHI Prayas",     path: "/en/programs/nidhi-prayas",     editHref: "/admin/content/programs/nidhi-prayas" },
      { title: "NIDHI EIR",        path: "/en/programs/nidhi-eir",        editHref: "/admin/content/programs/nidhi-eir" },
      { title: "SISF",             path: "/en/programs/sisf",             editHref: "/admin/content/programs/sisf" },
      { title: "BioNEST",          path: "/en/programs/bionest",          editHref: "/admin/content/programs/bionest" },
      { title: "Genesis",          path: "/en/programs/genesis",          editHref: "/admin/content/programs/genesis" },
    ],
  },
  {
    title: "Events",
    path: "/en/events",
    editHref: "/admin/content/events",
    children: [
      { title: "Events Archive", path: "/en/events/archive", isStatic: true },
    ],
  },
  {
    title: "Notifications",
    path: "/en/notifications",
    isStatic: true,
    children: [
      { title: "Careers",            path: "/en/notifications/careers",            editHref: "/admin/content/notifications" },
      { title: "Call for Proposals", path: "/en/notifications/call-for-proposals", editHref: "/admin/content/notifications" },
      { title: "NIQ / Tender",       path: "/en/notifications/niq-tender",         editHref: "/admin/content/notifications" },
    ],
  },
  {
    title: "Downloads",
    path: "/en/downloads",
    editHref: "/admin/content/downloads",
  },
  {
    title: "About",
    path: "/en/about",
    editHref: "/admin/pages/about",
    children: [
      { title: "Governance",      path: "/en/about/governance",      editHref: "/admin/pages/about" },
      { title: "Evaluation Team", path: "/en/about/evaluation-team", editHref: "/admin/pages/about" },
      { title: "Staff",           path: "/en/about/staff",           editHref: "/admin/pages/about" },
    ],
  },
  {
    title: "Contact",
    path: "/en/contact",
    editHref: "/admin/pages/contact",
  },
  {
    title: "Apply",
    path: "/en/apply",
    editHref: "/admin/forms",
  },
  {
    title: "Facilities",
    path: "/en/facilities",
    isStatic: true,
    children: [
      { title: "Clean Room",         path: "/en/facilities/clean-room",      isStatic: true },
      { title: "Design & Simulation",path: "/en/facilities/design-sim",      isStatic: true },
      { title: "ESDM",               path: "/en/facilities/esdm",            isStatic: true },
      { title: "Mech & Packaging",   path: "/en/facilities/mech-packaging",  isStatic: true },
      { title: "PCB Fabrication",    path: "/en/facilities/pcb-fab",         isStatic: true },
      { title: "Test & Calibration", path: "/en/facilities/test-cal",        isStatic: true },
    ],
  },
  {
    title: "Portfolio",
    path: "/en/portfolio",
    isStatic: true,
    children: [
      { title: "MEITY",        path: "/en/portfolio/meity",       isStatic: true },
      { title: "SISF",         path: "/en/portfolio/sisf",        isStatic: true },
      { title: "NIDHI Prayas", path: "/en/portfolio/nidhi-prayas",isStatic: true },
      { title: "NIDHI EIR",    path: "/en/portfolio/nidhi-eir",   isStatic: true },
      { title: "Genesis",      path: "/en/portfolio/genesis",     isStatic: true },
    ],
  },
  {
    title: "Policies",
    path: "/en/policies",
    isStatic: true,
    children: [
      { title: "Privacy",      path: "/en/policies/privacy",      isStatic: true },
      { title: "Terms",        path: "/en/policies/terms",        isStatic: true },
      { title: "Copyright",    path: "/en/policies/copyright",    isStatic: true },
      { title: "Hyperlinking", path: "/en/policies/hyperlinking", isStatic: true },
      { title: "Security",     path: "/en/policies/security",     isStatic: true },
      { title: "Accessibility",path: "/en/policies/accessibility",isStatic: true },
    ],
  },
  {
    title: "Search",
    path: "/en/search",
    isStatic: true,
  },
  {
    title: "Sitemap",
    path: "/en/sitemap",
    isStatic: true,
  },
];

export default async function SiteMapPage() {
  await requireAuth();

  type Node = typeof TREE[number];
  const countPages = (nodes: Node[]): number =>
    nodes.reduce((n, p) => n + 1 + ("children" in p && p.children ? (p.children as Node[]).length : 0), 0);
  const countEditable = (nodes: Node[]): number =>
    nodes.reduce((n, p) => {
      const self = "editHref" in p && p.editHref ? 1 : 0;
      const kids = "children" in p && p.children ? (p.children as Node[]).filter((c) => "editHref" in c && c.editHref).length : 0;
      return n + self + kids;
    }, 0);
  const total = countPages(TREE);
  const editable = countEditable(TREE);

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Map className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Site Map</h1>
      </div>
      <p className="text-sm mb-8" style={{ color: "#7a8e6a" }}>
        All {total} public pages. {editable} have editable CMS content — hover a row to see Edit / View buttons.
      </p>

      <div
        className="rounded-xl border p-4"
        style={{ borderColor: "#d4e6c4", backgroundColor: "white" }}
      >
        <SiteMapTree nodes={TREE} />
      </div>

      <p className="mt-4 text-xs" style={{ color: "#9ca3af" }}>
        <span className="inline-block px-1.5 py-0.5 rounded-full mr-1" style={{ backgroundColor: "#f3f4f6", color: "#9ca3af" }}>static</span>
        = no CMS editor; content is hardcoded or managed via JSON files.
      </p>
    </main>
  );
}
