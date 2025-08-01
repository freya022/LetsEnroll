import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";

export default function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <AppHeaderItem />
      </SidebarMenu>
    </SidebarHeader>
  );
}

function AppHeaderItem() {
  return (
    <SidebarMenuItem className="flex items-center gap-x-2 overflow-hidden">
      <img
        alt="Let's Enroll Logo"
        src="/logo.svg"
        className="size-8 rounded-full"
      />
      <span>Let's Enroll</span>
    </SidebarMenuItem>
  );
}
