import { requireAuth } from "@/lib/auth";
import { FolderOpen } from "lucide-react";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media — IC IITP Admin" };

export default async function MediaPage() {
  await requireAuth();
  return (
    <main className="p-8 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <FolderOpen className="w-6 h-6" style={{ color: "#3a5214" }} />
        <h1 className="text-2xl font-black" style={{ color: "#1c2e06" }}>Media Library</h1>
      </div>
      <MediaLibrary />
    </main>
  );
}
