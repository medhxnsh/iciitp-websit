"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

interface SiteMapNodeProps {
  title: string;
  path: string;
  editHref?: string;
  isStatic?: boolean;
  children?: SiteMapNodeProps[];
  depth?: number;
}

function NodeRow({ title, path, editHref, isStatic, depth = 0 }: Omit<SiteMapNodeProps, "children">) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-[#f5f9f0] transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium truncate" style={{ color: "#1c2e06" }}>{title}</span>
        <span className="text-[11px] shrink-0" style={{ color: "#7a8e6a" }}>{path.replace("/en", "") || "/"}</span>
        {isStatic && !editHref && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
            title="Content is hardcoded — requires a developer to change"
            style={{ backgroundColor: "#f3f4f6", color: "#9ca3af", cursor: "help" }}
          >
            dev-only
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {editHref ? (
          <Link
            href={editHref}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md"
            style={{ backgroundColor: "#3a5214", color: "white" }}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Link>
        ) : (
          <span className="text-[10px] px-2.5 py-1 rounded-md" style={{ color: "#c4cfc0", backgroundColor: "#f5f5f5" }}>
            No editor
          </span>
        )}
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md border"
          style={{ borderColor: "#c4d9b0", color: "#3a5214" }}
        >
          <ExternalLink className="w-3 h-3" />
          View
        </a>
      </div>
    </div>
  );
}

export function SiteMapTree({ nodes }: { nodes: SiteMapNodeProps[] }) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node, i) => (
        <div key={node.path}>
          <NodeRow {...node} />
          {node.children && node.children.length > 0 && (
            <div className="ml-6 pl-3 border-l" style={{ borderColor: "#d4e6c4" }}>
              <div className="space-y-0.5">
                {node.children.map((child) => (
                  <div key={child.path}>
                    <NodeRow {...child} depth={1} />
                    {child.children && child.children.length > 0 && (
                      <div className="ml-6 pl-3 border-l" style={{ borderColor: "#d4e6c4" }}>
                        <div className="space-y-0.5">
                          {child.children.map((grandchild) => (
                            <NodeRow key={grandchild.path} {...grandchild} depth={2} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
