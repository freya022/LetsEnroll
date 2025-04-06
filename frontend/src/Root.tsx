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
import DiscordLogo from "@/assets/discord-mark-blue.svg";
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
import { ReactNode } from "react";

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
      <header className="flex items-center justify-between border-b bg-neutral-200 px-4 py-2 dark:bg-neutral-900">
        <div className="flex h-full items-center">
          <img
            alt="Commandinator Logo"
            src="/logo-round.svg"
            className="size-8 rounded-full"
          />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:w-[1.5px]" />
          <NavBarLink to={`/`}>Home</NavBarLink>
          {user && <NavBarLink to={`/dashboard`}>Dashboard</NavBarLink>}
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle />
          {user ? <User user={user} /> : <LogIn />}
        </div>
      </header>
      <main className="grow p-4">
        <Outlet />
      </main>
    </div>
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
          (isPending && !isActive) ? "opacity-25" : "",
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
        <img alt="Discord logo" src={DiscordLogo} className="size-6" />
        Log in
      </a>
    </Button>
  );
}
