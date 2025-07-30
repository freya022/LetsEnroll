import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar.tsx";
import AppSidebarHeader from "@/sidebar/AppSidebarHeader.tsx";
import AppSidebarContent from "@/sidebar/AppSidebarContent.tsx";
import AppSidebarFooter from "@/sidebar/AppSidebarFooter.tsx";
import { UserDTO } from "@/dto/UserDTO.ts";

// TODO set "isActive" on current page's button
export default function AppSidebar({ user }: { user?: UserDTO }) {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <SidebarSeparator />
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
