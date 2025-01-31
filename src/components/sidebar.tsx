import type { FileRouteTypes } from "@/routeTree.gen";
import { Link } from "@tanstack/react-router";
import {
  BoxesIcon,
  HomeIcon,
  LibraryIcon,
  PodcastIcon,
  SettingsIcon,
} from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UiSidebar,
} from "./ui/sidebar";

const navItems = [
  {
    link: "/",
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    link: "/library",
    title: "Library",
    icon: <LibraryIcon />,
  },
  {
    link: "/tasks",
    title: "Tasks",
    icon: <BoxesIcon />,
  },
] as const satisfies Array<{
  link: FileRouteTypes["to"];
  title: string;
  icon: React.ReactNode;
}>;

export const Sidebar = () => {
  return (
    <UiSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex gap-2 pl-1 overflow-hidden items-center select-none">
              <div className="p-1 bg-purple-500 rounded-full w-fit text-neutral-50">
                <PodcastIcon size={18} />
              </div>
              <p className="font-semibold">PodPost</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.link}>
                  <SidebarMenuButton asChild>
                    <Link to={item.link} activeProps={{ "data-active": true }}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings" activeProps={{ "data-active": true }}>
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </UiSidebar>
  );
};
