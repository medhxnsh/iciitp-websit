import type { Download } from "@/lib/content-types";
import { FileDown, ExternalLink as ExternalLinkIcon } from "lucide-react";

interface DownloadRowProps {
  download: Download;
}

export function DownloadRow({ download }: DownloadRowProps) {
  const isExternal = download.path.startsWith("http");

  return (
    <div className="flex items-start gap-4 p-4 rounded-[--radius-lg] border border-[--color-border] bg-[--color-surface] hover:bg-[--color-brand-50] hover:border-[--color-brand-300] transition-all group">
      <div className="shrink-0 w-10 h-10 rounded-[--radius-md] bg-[--color-brand-100] text-[--color-brand-800] flex items-center justify-center">
        <FileDown className="w-5 h-5" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-sm text-[--color-text] leading-snug">{download.title}</p>
            <p className="text-xs text-[--color-text-subtle] mt-0.5">{download.purpose}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[--color-surface-alt] border border-[--color-border] text-[--color-muted]">
              {download.format}
            </span>
            {download.size && (
              <span className="text-xs text-[--color-muted]">{download.size}</span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4">
          {isExternal ? (
            <a
              href={download.path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[--color-primary] hover:underline"
              aria-label={`Download ${download.title} (opens in new tab)`}
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
              Download
            </a>
          ) : (
            <a
              href={download.path}
              download
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[--color-primary] hover:underline"
              aria-label={`Download ${download.title}`}
            >
              <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
              Download
            </a>
          )}
          {download.lastUpdated && (
            <span className="text-xs text-[--color-muted]">
              Updated: {new Date(download.lastUpdated).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}
            </span>
          )}
          <span className="text-xs text-[--color-muted]">{download.category}</span>
        </div>
      </div>
    </div>
  );
}
