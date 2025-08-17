import axios from "axios";
import { CustomEmojiCandidate } from "@/emoji-picker/types/emojis.ts";

export function getCustomEmojisQueryKey(guildId: string) {
  return ["custom_emojis", guildId]
}

export async function getCustomEmojis(guildId: string) {
  const response = await axios.get(`/api/guilds/${guildId}/emojis`);
  return response.data as CustomEmojiCandidate[];
}
