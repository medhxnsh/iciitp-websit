"use client";

import { useTransition } from "react";
import { deleteEventAction } from "./actions";

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        startTransition(() => deleteEventAction(id));
      }}
      className="text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50"
      style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
