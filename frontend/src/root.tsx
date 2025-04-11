import "@/App.css";
import { NavLink, Outlet, To, useLoaderData } from "react-router";
import { UserDTO } from "@/dto/UserDTO.ts";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { fetcher } from "@/utils.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { ReactNode, Suspense } from "react";
import DiscordLogoBlue from "@/assets/discord-mark-blue.svg";
import DiscordLogoWhite from "@/assets/Discord-Symbol-White.svg?react";
import Github from "@/assets/github.svg?react";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  user?: UserDTO;
}

async function loader(): Promise<Props> {
  const userResponse = await fetch("/api/user");
  const user: UserDTO = userResponse.ok ? await userResponse.json() : undefined;

  return {
    user,
  };
}

Root.loader = loader;

export default function Root() {
  const { user } = useLoaderData<Props>();

  return (
    <div className="flex h-full flex-col">
      <header className="grid grid-cols-[1fr_min-content_1fr] items-center border-b bg-neutral-200 px-4 py-2 dark:bg-neutral-900">
        <div className="flex h-full items-center">
          <img
            alt="Let's Enroll Logo"
            src="/logo.svg"
            className="size-8 rounded-full"
          />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:w-[1.5px]"
          />
          <NavBarLink to={`/`}>Home</NavBarLink>
          {user && <NavBarLink to={`/dashboard`}>Dashboard</NavBarLink>}
        </div>
        {/* Use brand colors */}
        <Button
          variant="outline"
          className="bg-[hsl(235,86%,65%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(235,86%,60%)] hover:text-[hsl(0,0%,100%)]"
          asChild
        >
          <a
            href="https://discord.com/oauth2/authorize?client_id=1327727455716245564&permissions=268435456&integration_type=0&scope=bot"
            target="_blank"
          >
            <DiscordLogoWhite aria-label="Discord logo" className="size-6" />
            Invite me
          </a>
        </Button>
        <div className="flex items-center justify-end gap-x-2">
          <ModeToggle />
          {user ? <User user={user} /> : <LogIn />}
        </div>
      </header>
      <main className="grow p-4">
        <Outlet />
      </main>
      <footer className="grid grid-cols-[1fr_auto_1fr] items-center border-t bg-neutral-200 px-4 py-2 dark:bg-neutral-900">
        <div>
          <FooterVersion />
        </div>
        <p className="text-secondary-foreground text-sm">
          {user === undefined && "Log in to access the dashboard"}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="justify-self-end"
          asChild
        >
          <a href="https://github.com/freya022/LetsEnroll" target="_blank">
            <Github className="fill-primary size-6" aria-label="Github" />
          </a>
        </Button>
      </footer>
    </div>
  );
}

function FooterVersion() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary fallback={<></>} onReset={reset}>
      <Suspense fallback={<Skeleton className="h-4 w-[75px]" />}>
        <Version />
      </Suspense>
    </ErrorBoundary>
  );
}

function Version() {
  const { data: versionHash } = useSuspenseQuery({
    queryKey: ["version"],
    queryFn: () => axios.get("api/version").then((res) => res.data as string),
  });

  return (
    <a
      className="text-secondary-foreground/60 text-sm"
      href={`https://github.com/freya022/LetsEnroll/commit/${versionHash}`}
      target="_blank"
    >
      {versionHash.substring(0, 10)}
    </a>
  );
}

function NavBarLink({ to, children }: { to: To; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isPending, isActive }) =>
        [
          "transition-opacity delay-50 duration-200 ease-in-out",
          "hover:bg-accent px-2 py-1",
          // is(Not)Active prevents the animation when loading a child route
          isPending && !isActive ? "opacity-25" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function User({ user }: { user: UserDTO }) {
  async function handleLogout() {
    await fetcher("/logout", {
      method: "POST",
    });
    window.location.href = "/";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md p-1">
        <Avatar className="size-7">
          <AvatarImage
            src={getAvatarUrl(user)}
            alt={`${user.effectiveName} avatar`}
          />
          <AvatarFallback>{user.effectiveName}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{user.effectiveName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getAvatarUrl({ id, avatarHash }: UserDTO) {
  if (avatarHash) {
    const extension = avatarHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${extension}`;
  } else {
    return `https://cdn.discordapp.com/avatars/${(BigInt(id) >> BigInt(22)) % BigInt(6)}.png`;
  }
}

function LogIn() {
  return (
    <Button asChild>
      <a href="/oauth2/authorization/discord">
        <img alt="Discord logo" src={DiscordLogoBlue} className="size-6" />
        Log in
      </a>
    </Button>
  );
}
