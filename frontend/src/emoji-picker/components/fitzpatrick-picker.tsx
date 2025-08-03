import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";

const clapEmoji = unicodeEmojis.find((emoji) => emoji.names.includes("clap"))!;

export function FitzpatrickPicker({
  fitzpatrickIndex,
  setFitzpatrickIndex,
  size,
}: {
  fitzpatrickIndex: number;
  setFitzpatrickIndex: (index: number) => void;
  size: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          className="cursor-pointer"
          aria-label="Select skin color"
        >
          <UnicodeEmoji emoji={clapEmoji} fitzpatrickIndex={fitzpatrickIndex} emojiSize={size} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-secondary flex w-max flex-col gap-1 border-none p-0">
        {[clapEmoji.unicode, ...clapEmoji.variants].map((variant, index) => (
          <div
            role="button"
            className="hover:bg-background/50 cursor-pointer p-1"
            onClick={() => {
              setFitzpatrickIndex(index);
              setOpen(false);
            }}
            key={variant}
          >
            <UnicodeEmoji emoji={clapEmoji} fitzpatrickIndex={index} emojiSize={size} />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
