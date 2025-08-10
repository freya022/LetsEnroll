import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import EmojiProperty from "@/roles-config-editor-2/components/properties/primitive/emoji.tsx";
import { ButtonStyles } from "@/dto/RolesConfigDTO.ts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useRef } from "react";
import { capitalize } from "@/utils.ts";

export default function ButtonProperties() {
  return (
    <>
      <ButtonStyleToggleGroupProperty
        label="Style"
        path="message.0.components.0.components.0.style"
      />
      <SingleLineProperty
        label="Role name (100 characters max)"
        placeholder="Role name"
        description="The role toggled by this button, it will be created if it does not exist"
        path="message.0.components.0.components.0.role_name"
      />
      <SingleLineProperty
        label="Label - Optional (80 characters max)"
        placeholder="Button label"
        path="message.0.components.0.components.0.label"
      />
      <EmojiProperty
        label="Emoji - Optional"
        path="message.0.components.0.components.0.emoji"
      />
    </>
  );
}

function ButtonStyleToggleGroupProperty({
  path,
  label,
}: {
  path: string;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Property>
      <Label onClick={() => inputRef.current?.focus()} htmlFor={path}>
        {label}
      </Label>
      <ToggleGroup
        variant="outline"
        type="single"
        onValueChange={(value) => {}}
        defaultValue="PRIMARY"
        className="w-full"
      >
        {ButtonStyles.map((style) => (
          <ToggleGroupItem
            value={style}
            aria-label={`Toggle ${style.toLowerCase()}`}
            key={style}
          >
            {capitalize(style.toLowerCase())}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </Property>
  );
}
