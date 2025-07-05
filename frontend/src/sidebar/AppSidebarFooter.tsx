import { Avatar } from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Github from "@/assets/github.svg?react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { ChevronRight, Computer, LogOut, Moon, Sun } from "lucide-react";

export default function AppSidebarFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <VersionItem />
        <ThemeItem />
        <ProfileItem />
      </SidebarMenu>
    </SidebarFooter>
  );
}

function VersionItem() {
  return (
    <SidebarMenuItem className="flex w-full items-center gap-2 overflow-hidden p-2 text-sm">
      <a href="https://github.com/freya022/LetsEnroll" target="_blank">
        <Github className="fill-primary size-4" aria-label="Github" />
      </a>
      <span>Version </span>
      <a
        href="https://github.com/freya022/LetsEnroll/commit/79cb246603abc166cd6241266ec9c7526b92dce4"
        target="_blank"
        className="ml-auto"
      >
        <code className="rounded-md bg-gray-300 px-1 py-0.5 text-blue-800 dark:bg-gray-950 dark:text-blue-500">
          79cb246603
        </code>
      </a>
    </SidebarMenuItem>
  );
}

function ThemeItem() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            <Sun
              aria-label="Light mode"
              className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            />
            <Moon
              aria-label="Dark mode"
              className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            />
            <span>Theme</span>
            <ChevronRight className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="min-w-40">
          <DropdownMenuItem>
            <Sun aria-label="Light mode" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Moon aria-label="Dark mode" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Computer aria-label="System" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function ProfileItem() {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg">
            <Avatar>
              <img
                className="aspect-square size-full"
                alt="freya02 avatar"
                src="https://cdn.discordapp.com/avatars/222046562543468545/53692122a3172fa41e481f66a7a98da4.png"
              />
            </Avatar>
            <span>freya02</span>
            <ChevronRight className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="min-w-40">
          <DropdownMenuItem>
            <LogOut />
            <span className="text-destructive">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
