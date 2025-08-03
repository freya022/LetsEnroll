import {
  getEmojiOffsets,
  getEmojiSheetSize,
  getEmojiSheetSrc,
} from "@/emoji-picker/utils/spritesheet.ts";
import { UnicodeEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import { useMemo } from "react";
import { getHumanName } from "@/emoji-picker/unicode-emojis.ts";

export function UnicodeEmoji({
  emoji,
  fitzpatrickIndex,
  emojiSize,
}: {
  emoji: UnicodeEmojiCandidate;
  fitzpatrickIndex: number;
  emojiSize: number;
}) {
  const emojiSheetSrc = useMemo(
    () => getEmojiSheetSrc(emoji, fitzpatrickIndex),
    [emoji, fitzpatrickIndex],
  );
  const [clapOffsetX, clapOffsetY] = useMemo(
    () => getEmojiOffsets(emoji, emojiSize),
    [emoji, emojiSize],
  );
  const [sheetWidth, sheetHeight] = useMemo(
    () => getEmojiSheetSize(emoji, emojiSize),
    [emoji, emojiSize],
  );

  return (
    <div
      role="img"
      style={{
        backgroundImage: `url(${emojiSheetSrc})`,
        backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
        backgroundPositionX: clapOffsetX,
        backgroundPositionY: clapOffsetY,
        width: emojiSize,
        height: emojiSize,
      }}
      aria-label={`'${getHumanName(emoji)}' emoji, skin tone ${fitzpatrickIndex}`}
    />
  );
}
