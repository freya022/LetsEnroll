import "./App.css";
import { Link, Outlet, useLoaderData } from "react-router";
import { UserDTO } from "./dto/UserDTO.ts";
import { ModeToggle } from "./components/mode-toggle.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import DiscordLogo from "@/assets/discord-mark-blue.svg";

interface Props {
  user?: UserDTO;
}

export async function loader(): Promise<Props> {
  const userResponse = await fetch("/api/user");
  const user: UserDTO = userResponse.ok ? await userResponse.json() : undefined;

  return {
    user,
  };
}

export function Root() {
  const { user } = useLoaderData<Props>();

  return (
    <>
      <div className="flex items-center border-b px-4 py-2">
        <div className="grow">
          <Link to={`/`} className="flex max-w-min items-center gap-x-1">
            <img
              alt="Commandinator Logo"
              src="/logo-round.svg"
              className="size-8 rounded-full"
            />
            <span className="grow">Commandinator</span>
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <ModeToggle />
          {user ? <User user={user} /> : <LogIn />}
        </div>
      </div>
      <div className="h-auto p-2">
        <Outlet />
      </div>
    </>
  );
}

function User({ user }: { user: UserDTO }) {
  return (
    <Avatar>
      <AvatarImage
        src={getAvatarUrl(user)}
        alt={`${user.effectiveName} avatar`}
      />
      <AvatarFallback>{user.effectiveName}</AvatarFallback>
    </Avatar>
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
