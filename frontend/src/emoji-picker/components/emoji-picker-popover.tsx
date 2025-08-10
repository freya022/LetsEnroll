import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { EmojiPicker } from "@/emoji-picker/components/emoji-picker.tsx";
import { ChevronsUpDown, X } from "lucide-react";
import { ComponentProps, forwardRef, useState } from "react";
import { CustomEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import { Button as ButtonComponent } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { getHumanName, unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";

export default function EmojiPickerPopover({
  selectedEmoji,
  customEmojis,
  onChange,
}: {
  selectedEmoji: string | null;
  customEmojis: CustomEmojiCandidate[];
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="grow" asChild>
          <EmojiPickerTrigger
            open={open}
            selectedEmoji={selectedEmoji}
            customEmojis={customEmojis}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <EmojiPicker
            customEmojis={customEmojis}
            onSelect={(formattedEmoji) => {
              onChange(formattedEmoji);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <ClearEmoji onClear={() => onChange(null)} />
    </div>
  );
}

function ClearEmoji({ onClear }: { onClear: () => void }) {
  return (
    <X
      role="button"
      tabIndex={0}
      aria-label="Remove emoji"
      className="text-destructive hover:bg-accent size-9 cursor-pointer rounded-sm focus:outline-2"
      onClick={onClear}
    />
  );
}

interface EmojiPickerTriggerProps extends ComponentProps<"button"> {
  open: boolean;
  selectedEmoji: string | null;
  customEmojis: CustomEmojiCandidate[];
}
const EmojiPickerTrigger = forwardRef<
  HTMLButtonElement,
  EmojiPickerTriggerProps
>(({ customEmojis, open, selectedEmoji, ...props }, ref) => (
  <ButtonComponent
    {...props}
    role="combobox"
    aria-expanded={open}
    variant="secondary"
    className={cn("justify-between", props.className)}
    type="button"
    ref={ref}
  >
    {selectedEmoji ? (
      <SelectedEmoji
        formattedEmoji={selectedEmoji}
        customEmojis={customEmojis}
      />
    ) : (
      "No emoji"
    )}
    <ChevronsUpDown aria-hidden="true" className="opacity-50" />
  </ButtonComponent>
));

function SelectedEmoji({
  formattedEmoji,
  customEmojis,
}: {
  formattedEmoji: string;
  customEmojis: CustomEmojiCandidate[];
}) {
  const customMatch = formattedEmoji.match(/<a?:\w+:(\d+)>/);
  if (customMatch) {
    const id = customMatch[1];
    const emoji = customEmojis.find((e) => e.id === id)!;

    const alt = `'${emoji.name}' emoji`;
    const src = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?animated=true`;
    return (
      <div className="flex items-center gap-2">
        <img src={src} alt={alt} className="size-6" />
        <span>{emoji.name}</span>
      </div>
    );
  } else {
    const emoji = unicodeEmojis.find(
      (e) =>
        e.unicode === formattedEmoji || e.variants.includes(formattedEmoji),
    )!;
    // +1 because 0 is the default diversity, which is the emoji object itself,
    // equivalent to [emoji.unicode, ...emoji.variants].indexOf(formattedEmoji)
    const fitzpatrickIndex = emoji.variants.indexOf(formattedEmoji) + 1;

    return (
      <div className="flex items-center gap-2">
        <UnicodeEmoji
          emoji={emoji}
          fitzpatrickIndex={fitzpatrickIndex}
          emojiSize={24}
        />
        <span>{getHumanName(emoji)}</span>
      </div>
    );
  }
}
