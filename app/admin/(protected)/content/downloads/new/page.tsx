import { requireAuth } from "@/lib/auth";
import { DownloadForm } from "../_form";
import { createDownloadAction } from "../actions";
import { Download } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Add Download — IC IITP Admin" };

export default async function NewDownloadPage() {
  await requireAuth();
  return (
    <main className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/content/downloads" className="text-sm" style={{ color: "#7a8e6a" }}>
          ← Downloads
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Download className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black" style={{ color: "#1c2e06" }}>Add Download</h1>
      </div>
      <DownloadForm onSave={createDownloadAction} />
    </main>
  );
}
