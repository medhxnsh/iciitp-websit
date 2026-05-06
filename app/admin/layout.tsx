import "../globals.css";

/** Admin root — passthrough. Auth is gated per route group: (dashboard)/layout.tsx */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
