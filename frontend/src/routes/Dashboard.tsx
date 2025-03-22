import axios from "axios";
import { hasPermission } from "@/utils.ts";
import { Link, Outlet, useLoaderData, useNavigation } from "react-router";
import { ChevronRight } from "lucide-react";
import Spinner from "@/assets/spinner.svg?react";

const MANAGE_SERVER = BigInt(1) << BigInt(5);
const MANAGE_ROLES = BigInt(1) << BigInt(28);

interface GuildDTO {
  id: string;
  name: string;
  icon: string;
  permissions: string;
}

interface Props {
  managedGuilds: GuildDTO[];
}

async function loader(): Promise<Props> {
  const sharedGuilds = await axios
    .get("/api/guilds")
    .then<GuildDTO[]>((res) => res.data);
  const managedGuilds = sharedGuilds.filter((guild) =>
    hasPermission(guild.permissions, MANAGE_SERVER, MANAGE_ROLES),
  );

  return {
    managedGuilds,
  };
}

Dashboard.loader = loader;

export default function Dashboard() {
  const { managedGuilds } = useLoaderData<Props>();

  return (
    <div className="flex h-full">
      <div className="flex h-full flex-col p-1">
        <ul className="border-border flex w-sm grow flex-col rounded-lg border-2">
          {managedGuilds.map((guild) => (
            <li key={guild.id}>
              <Link to={`./${guild.id}`}>
                <Guild guild={guild} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

function Guild({ guild }: { guild: GuildDTO }) {
  const { location } = useNavigation();
  const loading = location?.pathname.endsWith(guild.id) ?? false;

  return (
    <div className="hover:bg-accent flex cursor-pointer items-center gap-2 p-2">
      <img
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?animated=true`}
        alt={`${guild.name} icon`}
        className="border-border size-16 rounded-full border-1"
      />
      <span className="grow">{guild.name}</span>
      {loading ? (
        <Spinner className="dark:stroke-foreground stroke-foreground size-6 animate-spin" />
      ) : (
        <ChevronRight className="size-6" />
      )}
    </div>
  );
}
