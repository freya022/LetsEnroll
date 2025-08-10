import { CustomEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import { Label } from "@/components/ui/label.tsx";
import EmojiPickerPopover from "@/emoji-picker/components/emoji-picker-popover.tsx";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";

export default function EmojiProperty({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  const selectedEmoji: string | null = null;
  const customEmojis: CustomEmojiCandidate[] = [];

  return (
    <Property>
      <Label htmlFor={path}>{label}</Label>
      {/* TODO set ID here */}
      <EmojiPickerPopover
        selectedEmoji={selectedEmoji}
        customEmojis={customEmojis}
        onChange={(newEmoji) => {}}
      />
    </Property>
  );
}
