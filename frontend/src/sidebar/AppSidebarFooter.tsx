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
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import axios from "axios";
import { useTheme } from "@/components/theme-provider.tsx";

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
  const { reset } = useQueryErrorResetBoundary();

  return (
    <SidebarMenuItem className="flex w-full items-center gap-2 overflow-hidden p-2 text-sm">
      <a href="https://github.com/freya022/LetsEnroll" target="_blank">
        <Github className="fill-primary size-4" aria-label="Github" />
      </a>
      <ErrorBoundary fallback={<>GitHub</>} onReset={reset}>
        <Suspense fallback={<VersionSkeleton />}>
          {/* Load in a separate component, or it will block */}
          <VersionDetails />
        </Suspense>
      </ErrorBoundary>
    </SidebarMenuItem>
  );
}

function VersionDetails() {
  const { data: versionHash } = useSuspenseQuery({
    queryKey: ["version"],
    queryFn: () => axios.get("/api/version").then((res) => res.data as string),
    staleTime: Infinity, // Never refresh
    retry: false,
  });

  return (
    <>
      <span>Version </span>
      <a
        href={`https://github.com/freya022/LetsEnroll/commit/${versionHash}`}
        target="_blank"
        className="ml-auto"
      >
        <code className="rounded-md bg-gray-300 px-1 py-0.5 text-blue-800 dark:bg-gray-950 dark:text-blue-500">
          {versionHash.substring(0, 10)}
        </code>
      </a>
    </>
  );
}

function VersionSkeleton() {
  return (
    <>
      <Skeleton className="h-5 w-16" />
      <Skeleton className="ml-auto h-5 w-20" />
    </>
  );
}

function ThemeItem() {
  const { setTheme } = useTheme();

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
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun aria-label="Light mode" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon aria-label="Dark mode" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
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
