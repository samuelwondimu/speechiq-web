"use client";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const headerTitle =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname.split("/")[2]?.charAt(0).toUpperCase() +
        pathname.split("/")[2]?.slice(1).replaceAll("-", " ");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex ite h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 [&_svg]:h-5.5! [&_svg]:w-5.5!">
            <SidebarTrigger className="-ml-1 size-8 hover:text-primary hover:cursor-pointer" />
            <h1 className="text-2xl font-bold">{headerTitle}</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
