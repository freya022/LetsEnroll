import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar.tsx";
import AppSidebarHeader from "@/sidebar/AppSidebarHeader.tsx";
import AppSidebarContent from "@/sidebar/AppSidebarContent.tsx";
import AppSidebarFooter from "@/sidebar/AppSidebarFooter.tsx";

// TODO set "isActive" on current page's button
export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent />
      <SidebarSeparator />
      <AppSidebarFooter />
    </Sidebar>
  );
}
