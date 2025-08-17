import { useCustomEmojisFromCurrentGuild } from "@/emoji-picker/hooks/use-custom-emojis.ts";
import { unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";
import {
  CustomEmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/emoji-picker/types/emojis.ts";
import { FC } from "react";

export default function Emoji({
  formattedEmoji,
  onUnicode,
  onCustom,
  onUnknown,
}: {
  formattedEmoji: string | null;
  onUnicode: FC<{ emoji: UnicodeEmojiCandidate; fitzpatrickIndex: number }>;
  onCustom: FC<{ emoji: CustomEmojiCandidate }>;
  onUnknown: FC;
}) {
  const UnicodeEmoji = onUnicode;
  const CustomEmoji = onCustom;
  const UnknownEmoji = onUnknown;

  const customEmojis = useCustomEmojisFromCurrentGuild();

  if (!formattedEmoji) {
    return <UnknownEmoji />;
  }

  const customMatch = formattedEmoji.match(/<a?:\w+:(\d+)>/);
  if (customMatch) {
    const id = customMatch[1];
    const emoji = customEmojis.find((e) => e.id === id);
    if (!emoji) {
      console.warn(
        `Could not find custom emoji with ID ${id}, emojis: ${customEmojis}`,
      );
      return <UnknownEmoji />;
    }

    return <CustomEmoji emoji={emoji} />;
  } else {
    const emoji = unicodeEmojis.find(
      (e) =>
        e.unicode === formattedEmoji || e.variants.includes(formattedEmoji),
    );
    if (!emoji) {
      console.warn(`Could not find unicode emoji '${formattedEmoji}'`);
      return <UnknownEmoji />;
    }
    // +1 because 0 is the default diversity, which is the emoji object itself,
    // equivalent to [emoji.unicode, ...emoji.variants].indexOf(formattedEmoji)
    const fitzpatrickIndex = emoji.variants.indexOf(formattedEmoji) + 1;

    return <UnicodeEmoji emoji={emoji} fitzpatrickIndex={fitzpatrickIndex} />;
  }
}
