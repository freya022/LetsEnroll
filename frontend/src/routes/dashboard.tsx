import axios from "axios";
import { hasPermission } from "@/utils.ts";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { ChevronRight } from "lucide-react";
import Spinner from "@/assets/spinner.svg?react";
import Confused from "@/assets/confused.svg?react";
import { GuildDTO } from "@/dto/GuildDTO.ts";

const MANAGE_SERVER = BigInt(1) << BigInt(5);
const MANAGE_ROLES = BigInt(1) << BigInt(28);

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
    <div className="flex h-full gap-x-4 p-1">
      <div className="w-sm">
        <ul className="flex h-full flex-col rounded-lg border-2 bg-neutral-200 dark:bg-neutral-900">
          {managedGuilds.length > 0 ? (
            managedGuilds.map((guild) => (
              <li key={guild.id}>
                <NavLink to={`./${guild.id}/roles`}>
                  {({ isPending }) => (
                    <Guild guild={guild} isPending={isPending} />
                  )}
                </NavLink>
              </li>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Confused aria-label="Confused Face" className="size-10" />
              <span className="text-lg text-neutral-600 italic dark:text-neutral-400">
                I am not in any of your guilds{" "}
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1327727455716245564&permissions=268435456&integration_type=0&scope=bot"
                  target="_blank"
                  className="underline"
                >
                  yet
                </a>
              </span>
            </div>
          )}
        </ul>
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}

function Guild({ guild, isPending }: { guild: GuildDTO; isPending: boolean }) {
  return (
    <div className="hover:bg-accent flex cursor-pointer items-center gap-2 p-2">
      <img
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?animated=true`}
        alt={`${guild.name} icon`}
        className="size-16 rounded-full border-1"
      />
      <span className="grow">{guild.name}</span>
      {isPending ? (
        <Spinner
          aria-label="Loading animation"
          className="dark:stroke-foreground stroke-foreground size-6 animate-spin"
        />
      ) : (
        <ChevronRight aria-label="Right chevron" className="size-6" />
      )}
    </div>
  );
}
