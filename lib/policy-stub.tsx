import { LastUpdatedBadge } from "@/components/last-updated-badge";

interface PolicyStubProps {
  title: string;
  description: string;
  lastUpdated?: string;
}

export function PolicyStub({ title, description, lastUpdated = "2025-09-01" }: PolicyStubProps) {
  return (
    <article>
      <header className="mb-8 pb-6 border-b border-[--color-border]">
        <h1 className="text-3xl font-bold text-[--color-text] mb-2">{title}</h1>
        <p className="text-[--color-text-subtle]">{description}</p>
        <div className="mt-3">
          <LastUpdatedBadge date={lastUpdated} />
        </div>
      </header>

      <div className="prose prose-green max-w-none text-[--color-text-subtle]">
        <div className="rounded-[--radius-md] border border-[--color-border] bg-[--color-surface-alt] p-4 mb-6">
          <p className="text-sm font-medium text-[--color-accent]">
            ⚠ This policy page is under review by legal counsel and will be published before site launch.
          </p>
        </div>

        <p>
          This page will contain the full {title.toLowerCase()} for the Incubation Centre, IIT Patna website,
          in compliance with Government of India Website Guidelines (GIGW v3.0).
        </p>

        <p>
          For queries related to this policy, please contact{" "}
          <a
            href="mailto:iciitp@iitp.ac.in"
            className="text-[--color-primary] underline hover:no-underline"
          >
            iciitp@iitp.ac.in
          </a>
          .
        </p>
      </div>
    </article>
  );
}
