import "@/App.css";
import { Outlet, useLoaderData } from "react-router";
import { UserDTO } from "@/dto/UserDTO.ts";
import { hasPermission, MANAGE_ROLES, MANAGE_SERVER } from "@/utils.ts";
import axios, { AxiosError } from "axios";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/sidebar/AppSidebar.tsx";
import { GuildDTO } from "@/dto/GuildDTO.ts";

interface Props {
  user?: UserDTO;
  guilds?: GuildDTO[];
}

async function loader(): Promise<Props> {
  const userResponse = await fetch("/api/user");
  const user: UserDTO = userResponse.ok ? await userResponse.json() : undefined;

  const sharedGuilds = await axios
    .get("/api/guilds")
    .then<GuildDTO[]>((res) => res.data)
    .catch((err) => {
      if (err instanceof AxiosError) {
        // Ignore when not connected
        if (err.status !== 401) console.error(err);
        return undefined;
      }
    });
  const managedGuilds = sharedGuilds?.filter((guild) =>
    hasPermission(guild.permissions, MANAGE_SERVER, MANAGE_ROLES),
  );

  return {
    user,
    guilds: managedGuilds,
  };
}

Root.loader = loader;

export default function Root() {
  const { user, guilds } = useLoaderData<Props>();

  return (
    <SidebarProvider>
      <AppSidebar user={user} guilds={guilds} />

      <main className="grow">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
