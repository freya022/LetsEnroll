import { useParams, useRouteLoaderData } from "react-router";
import { GuildDTO } from "@/dto/GuildDTO.ts";

export function useSelectedGuild() {
  const { guildId } = useParams<{ guildId: string }>();
  const { guilds } = useRouteLoaderData<{ guilds: GuildDTO[] }>(
    "root",
  )!;
  return guilds.find((g) => g.id === guildId!)!;
}
