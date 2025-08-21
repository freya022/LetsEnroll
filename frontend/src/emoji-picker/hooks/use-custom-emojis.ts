import { useQuery } from "@tanstack/react-query";
import {
  getCustomEmojis,
  getCustomEmojisQueryKey,
} from "@/emoji-picker/queries/custom-emojis.ts";
import { useSelectedGuild } from "@/hooks/use-selected-guild.ts";

export function useCustomEmojis(guildId: string) {
  const { data: customEmojis } = useQuery({
    queryKey: getCustomEmojisQueryKey(guildId),
    queryFn: async () => await getCustomEmojis(guildId),
    // The user could add an emoji and then come back here
    refetchOnWindowFocus: "always",
  });

  return customEmojis ?? [];
}

export function useCustomEmojisFromCurrentGuild() {
  const { id: guildId } = useSelectedGuild();
  return useCustomEmojis(guildId);
}
