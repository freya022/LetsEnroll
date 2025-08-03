import { EmojiCandidate, UnicodeEmojiCandidate } from "@/emoji-picker/types/emojis.ts";

export function getFormatted(emoji: EmojiCandidate, fitzpatrickIndex: number) {
  if ("unicode" in emoji) {
    return getUnicodeVariant(emoji, fitzpatrickIndex);
  } else {
    return `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
  }
}

export function getUnicodeVariant(
  emoji: UnicodeEmojiCandidate,
  fitzpatrickIndex: number,
) {
  if (emoji.variants.length == 0) {
    // No fitzpatrick
    return emoji.unicode;
  } else if (fitzpatrickIndex == 0) {
    // Has fitzpatrick, default color
    return emoji.unicode;
  } else {
    // Has fitzpatrick, selected color
    return emoji.variants[fitzpatrickIndex - 1];
  }
}

export function getAliases(emoji: EmojiCandidate) {
  if ("unicode" in emoji) {
    return emoji.names;
  } else {
    return [emoji.name];
  }
}
