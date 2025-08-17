import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import EmojiProperty from "@/roles-config-editor-2/components/properties/primitive/emoji.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { capitalize } from "@/utils.ts";
import {
  ButtonData,
  ButtonStyle,
  ButtonStyles,
} from "@/roles-config-editor-2/types/components.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function ButtonProperties({
  button,
  controls,
}: {
  button: ButtonData;
  controls: Controls<ButtonData>;
}) {
  function onStyleChange(value: ButtonStyle) {
    controls.update({
      ...button,
      style: value,
    });
  }

  function onRoleNameChange(value: string) {
    controls.update({
      ...button,
      roleName: value,
    });
  }

  function onLabelChange(value: string) {
    controls.update({
      ...button,
      label: value,
    });
  }

  function onEmojiChange(value: string | null) {
    controls.update({
      ...button,
      emoji: value,
    });
  }

  return (
    <>
      <ButtonStyleToggleGroupProperty
        label="Style"
        defaultValue={button.style}
        onChange={onStyleChange}
      />
      <SingleLineProperty
        label="Role name (100 characters max)"
        placeholder="Role name"
        description="The role toggled by this button, it will be created if it does not exist"
        defaultValue={button.roleName}
        onChange={onRoleNameChange}
      />
      <SingleLineProperty
        label="Label - Optional (80 characters max)"
        placeholder="Button label"
        defaultValue={button.label ?? ""}
        onChange={onLabelChange}
      />
      <EmojiProperty
        label="Emoji - Optional"
        defaultValue={button.emoji}
        onChange={onEmojiChange}
      />
    </>
  );
}

function ButtonStyleToggleGroupProperty({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: ButtonStyle;
  onChange: (s: ButtonStyle) => void;
}) {
  return (
    <Property>
      <Label>{label}</Label>
      <ToggleGroup
        variant="outline"
        type="single"
        onValueChange={onChange}
        defaultValue={defaultValue}
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
