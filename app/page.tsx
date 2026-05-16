// With localePrefix: "never", next-intl middleware rewrites "/" → "/en/" internally.
// This file is unreachable in normal operation; notFound() is a safe fallback.
import { notFound } from "next/navigation";

export default function RootPage() {
  notFound();
}
