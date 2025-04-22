import {
  EmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/roles-config-editor/types.ts";

export function getEmojiHexCodepoints(unicode: string): string[] {
  const hexCodepoints: string[] = [];
  for (const codepoint of unicode) {
    hexCodepoints.push(codepoint.codePointAt(0)!.toString(16));
  }
  return hexCodepoints;
}

export function getEmojiSrc(
  emoji: UnicodeEmojiCandidate,
  fitzpatrickIndex: number,
) {
  return getUnicodeEmojiSrc(getFormatted(emoji, fitzpatrickIndex));
}

export function getUnicodeEmojiSrc(variation: string) {
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/svg/${getEmojiHexCodepoints(variation).join("-")}.svg`;
}

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