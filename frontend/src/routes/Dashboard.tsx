import axios from "axios";
import { hasPermission } from "@/utils.ts";

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

export function Dashboard() {
  return <></>;
}

Dashboard.loader = loader;
