import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { getUnicodeEmojiSrc } from "@/emoji-picker/utils.ts";

const claps = ["👏", "👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿"];

export function FitzpatrickPicker({
  fitzpatrickIndex,
  setFitzpatrickIndex,
}: {
  fitzpatrickIndex: number;
  setFitzpatrickIndex: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <img
          role="button"
          src={getUnicodeEmojiSrc(claps[fitzpatrickIndex])}
          alt="Select skin color"
          className="size-6 cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="bg-secondary flex w-max flex-col gap-1 border-none p-0">
        {claps.map((variant, index) => (
          <div
            key={variant}
            className="hover:bg-background/50 cursor-pointer p-1"
            onClick={() => {
              setFitzpatrickIndex(index);
              setOpen(false);
            }}
          >
            <img
              role="button"
              src={getUnicodeEmojiSrc(variant)}
              alt={`'Clap' emoji, skin tone ${index}`}
              className="size-6"
            />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
