import { Label } from "@/components/ui/label.tsx";
import EmojiPickerPopover from "@/emoji-picker/components/emoji-picker-popover.tsx";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { useId } from "react";

export default function EmojiProperty({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: string | null;
  onChange: (e: string | null) => void;
}) {
  const id = useId();

  return (
    <Property>
      <Label htmlFor={id}>{label}</Label>
      <EmojiPickerPopover defaultValue={defaultValue} id={id} onChange={onChange} />
    </Property>
  );
}
