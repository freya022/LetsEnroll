import "@/App.css";
import { Link, Outlet, useLoaderData } from "react-router";
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
        <div>
          <Link to={`/`} className="flex items-center gap-x-1">
            <img
              alt="Commandinator Logo"
              src="/logo-round.svg"
              className="size-8 rounded-full"
            />
            <span>Commandinator</span>
          </Link>
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
