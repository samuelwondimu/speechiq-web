"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../theme/mode-toggle";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function NavUser() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
        >
          <Avatar className="h-8 w-8 rounded-none">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name}
            />
            <AvatarFallback className="rounded-none">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{session?.user?.name}</span>
            <span className="truncate text-xs">{session?.user?.email}</span>
          </div>
          <ModeToggle />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
