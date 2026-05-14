import { requireAuth } from "@/lib/auth";
import { getDownloadById } from "@/lib/cms/downloads";
import { DownloadForm } from "../_form";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import Link from "next/link";
import type { DownloadInput } from "@/lib/cms/downloads";
import { updateDownloadAction } from "../actions";

export const metadata = { title: "Edit Download — IC IITP Admin" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditDownloadPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const download = await getDownloadById(id);
  if (!download) notFound();

  async function save(data: DownloadInput) {
    "use server";
    return updateDownloadAction(id, data);
  }

  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/content/downloads" className="text-sm" style={{ color: "#7a8e6a" }}>
          ← Downloads
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Download className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black truncate" style={{ color: "#1c2e06" }}>{download.title}</h1>
      </div>
      <DownloadForm initial={download} onSave={save} />
    </main>
  );
}
