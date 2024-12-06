import * as React from "react";
import {
  Building2,
  Edit,
  Plus,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/NavMain";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { LoginUserDetails } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import NavUserLoading from "./loading/NavUser";

// This is sample data.
const dataSample = {
  user: {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "/avatars/johndoe.jpg",
  },
  navMain: [
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Add",
          url: "/dashboard/users/add",
          icon: Plus,
        },
        {
          title: "Edit",
          url: "/dashboard/users/edit",
          icon: Edit,
        },
        {
          title: "Delete",
          url: "/dashboard/users/delete",
          icon: Trash2,
        },
      ],
    },
    {
      title: "Brands",
      url: "/dashboard/brands",
      icon: Building2,
      isActive: false,
      items: [
        {
          title: "Add",
          url: "/dashboard/brands/add",
          icon: Plus,
        },
        {
          title: "Edit",
          url: "/dashboard/brands/edit",
          icon: Edit,
        },
        {
          title: "Delete",
          url: "/dashboard/brands/delete",
          icon: Trash2,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: response, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: LoginUserDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to={"/dashboard"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ShoppingBag className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Nighat Cloth Store</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataSample.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? (
          <NavUserLoading />
        ) : (
          <NavUser user={response?.data.user || dataSample.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
