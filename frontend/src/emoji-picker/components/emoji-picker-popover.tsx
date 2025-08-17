import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { EmojiPicker } from "@/emoji-picker/components/emoji-picker.tsx";
import { ChevronsUpDown, X } from "lucide-react";
import { ComponentProps, forwardRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { getHumanName } from "@/emoji-picker/unicode-emojis.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";
import Emoji from "@/emoji-picker/components/emoji.tsx";
import {
  CustomEmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/emoji-picker/types/emojis.ts";

export default function EmojiPickerPopover({
  defaultValue,
  id,
  onChange,
}: {
  defaultValue: string | null;
  id: string;
  onChange: (value: string | null) => void;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  function handleSelect(formattedEmoji: string) {
    setSelectedEmoji(formattedEmoji);
    onChange(formattedEmoji);
    setOpen(false);
  }

  function handleClear() {
    setSelectedEmoji(null);
    onChange(null);
  }

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="grow" id={id} asChild>
          <EmojiPickerTrigger
            open={open}
            selectedEmoji={selectedEmoji}
            onClear={handleClear}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <EmojiPicker onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
      <ClearEmoji onClear={handleClear} />
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
  onClear: () => void;
}
const EmojiPickerTrigger = forwardRef<
  HTMLButtonElement,
  EmojiPickerTriggerProps
>(({ open, selectedEmoji, onClear, ...props }, ref) => (
  <Button
    {...props}
    role="combobox"
    aria-expanded={open}
    variant="secondary"
    className={cn("justify-between", props.className)}
    type="button"
    ref={ref}
  >
    <Emoji
      formattedEmoji={selectedEmoji}
      onUnicode={SelectedUnicodeEmoji}
      onCustom={SelectedCustomEmoji}
      onUnknown={() => {
        if (selectedEmoji != null)
          onClear();
        return "No emoji";
      }}
    />
    <ChevronsUpDown aria-hidden="true" className="opacity-50" />
  </Button>
));

function SelectedUnicodeEmoji({
  emoji,
  fitzpatrickIndex,
}: {
  emoji: UnicodeEmojiCandidate;
  fitzpatrickIndex: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <UnicodeEmoji
        emoji={emoji}
        fitzpatrickIndex={fitzpatrickIndex}
        emojiSize={24}
      />
      <span aria-hidden>
        {getHumanName(emoji)}
        {fitzpatrickIndex > 1 && `skin tone ${fitzpatrickIndex}`}
      </span>
    </div>
  );
}

function SelectedCustomEmoji({ emoji }: { emoji: CustomEmojiCandidate }) {
  const alt = `'${emoji.name}' emoji`;
  const src = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?animated=true`;
  return (
    <div className="flex items-center gap-2">
      <img src={src} alt={alt} className="size-6" />
      <span aria-hidden>{emoji.name}</span>
    </div>
  );
}
