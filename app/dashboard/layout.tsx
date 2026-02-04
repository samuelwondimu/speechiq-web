import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-72 p-6 border-r">
        <div className="text-lg font-bold">Sidebar</div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
