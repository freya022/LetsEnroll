import { UnicodeEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import emojis from "@/assets/emojis.json";
import { capitalize } from "@/utils.ts";

export const unicodeEmojis: UnicodeEmojiCandidate[] = emojis;

export function getHumanName(emoji: UnicodeEmojiCandidate): string {
  return capitalize(emoji.names[0].replace(/_/g, " "));
}
