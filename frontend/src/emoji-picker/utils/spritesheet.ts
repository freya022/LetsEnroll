import { UnicodeEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import { unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";

const hexFitzpatricks = ["", "1f3fb", "1f3fc", "1f3fd", "1f3fe", "1f3ff"];

export function getEmojiSheetSrc(
  emoji: UnicodeEmojiCandidate,
  fitzpatrickIndex: number,
): string {
  if (emoji.variants.length === 0) {
    // Sheet with all non-diversity emojis
    return "/spritesheet-emoji-40.png";
  } else {
    return `/spritesheet-${hexFitzpatricks[fitzpatrickIndex]}-40.png`;
  }
}

const MAX_DIVERSITY_INDEX = getMaxIndex((emoji) => emoji.variants.length > 0);
const MAX_NON_DIVERSITY_INDEX = getMaxIndex(
  (emoji) => emoji.variants.length == 0,
);

function getMaxIndex(
  filter: (emoji: UnicodeEmojiCandidate) => boolean,
): number {
  let maxIndex = 0;
  for (const unicodeEmoji of unicodeEmojis) {
    if (filter(unicodeEmoji)) {
      maxIndex = Math.max(maxIndex, unicodeEmoji.spriteIndex);
    }
  }
  return maxIndex;
}

export function getEmojiSheetSize(
  emoji: UnicodeEmojiCandidate,
  emojiSize: number,
): [width: number, height: number] {
  const maxIndex =
    emoji.variants.length === 0 ? MAX_NON_DIVERSITY_INDEX : MAX_DIVERSITY_INDEX;
  const maxPerRow =
    emoji.variants.length === 0
      ? MAX_PER_ROW_NON_DIVERSITY
      : MAX_PER_ROW_DIVERSITY;
  return [maxPerRow * emojiSize, Math.ceil(maxIndex / maxPerRow) * emojiSize];
}

const MAX_PER_ROW_NON_DIVERSITY = 42;
const MAX_PER_ROW_DIVERSITY = 10;

export function getEmojiOffsets(
  emoji: UnicodeEmojiCandidate,
  emojiSize: number,
): [number, number] {
  const maxPerRow =
    emoji.variants.length === 0
      ? MAX_PER_ROW_NON_DIVERSITY
      : MAX_PER_ROW_DIVERSITY;
  return [
    -((emoji.spriteIndex % maxPerRow) * emojiSize),
    -(Math.floor(emoji.spriteIndex / maxPerRow) * emojiSize),
  ];
}
