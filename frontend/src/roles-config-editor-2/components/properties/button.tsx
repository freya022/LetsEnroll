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
} from "@/roles-config-editor-2/types/component-data.ts";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";
import { useState } from "react";

export default function ButtonPropertiesPanel({
  button,
}: {
  button: ButtonData;
}) {
  const dispatch = useRolesConfigDispatch();

  function onDelete() {
    dispatch!({
      type: "delete",
      obj: button,
    });
  }

  return (
    <Properties name="Button" onDelete={onDelete}>
      <ButtonProperties button={button} />
    </Properties>
  );
}

function ButtonProperties({ button }: { button: ButtonData }) {
  const dispatch = useRolesConfigDispatch();

  function onStyleChange(value: ButtonStyle) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(button)!.style = value),
    });
  }

  function onRoleNameChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(button)!.roleName = value),
    });
  }

  function onLabelChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(button)!.label = value),
    });
  }

  function onEmojiChange(value: string | null) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(button)!.emoji = value),
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
  const [value, setValue] = useState(defaultValue);

  function handleChange(value: ButtonStyle) {
    if (!value) return;
    setValue(value);
    onChange(value);
  }

  return (
    <Property>
      <Label>{label}</Label>
      <ToggleGroup
        variant="outline"
        type="single"
        onValueChange={handleChange}
        value={value}
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
