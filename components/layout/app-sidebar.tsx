"use client";

import * as React from "react";
import { BookOpen, Bot, Settings2, Speech, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const data = React.useMemo(() => {
    return {
      user: {
        name: "Samuel Wondimu",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: SquareTerminal,
          isActive: pathname === "/dashboard",
        },
        {
          title: "Practice",
          url: "/dashboard/practice",
          icon: Bot,
          isActive: pathname === "/dashboard/practice",
        },
        {
          title: "Sessions",
          url: "/dashboard/sessions",
          icon: BookOpen,
          isActive: pathname === "/dashboard/sessions",
        },
        {
          title: "Progress",
          url: "/dashboard/progress",
          icon: Settings2,
          isActive: pathname === "/dashboard/progress",
        },
        {
          title: "Upgrade",
          url: "/dashboard/upgrade",
          icon: Settings2,
          isActive: pathname === "/dashboard/upgrade",
        },
      ],
    };
  }, [pathname]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          isActive={false}
          className="hover:bg-none! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
            <Speech className="size-6" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate text-lg font-extrabold">Speech IQ.</span>
            <span className="truncate text-xs">Free</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
