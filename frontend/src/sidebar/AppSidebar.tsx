import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar.tsx";
import AppSidebarHeader from "@/sidebar/AppSidebarHeader.tsx";
import AppSidebarContent from "@/sidebar/AppSidebarContent.tsx";
import AppSidebarFooter from "@/sidebar/AppSidebarFooter.tsx";
import { UserDTO } from "@/dto/UserDTO.ts";
import { GuildDTO } from "@/dto/GuildDTO.ts";

export default function AppSidebar({
  user,
  guilds,
}: {
  user?: UserDTO;
  guilds?: GuildDTO[];
}) {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <AppSidebarContent guilds={guilds} />
      <SidebarSeparator />
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
