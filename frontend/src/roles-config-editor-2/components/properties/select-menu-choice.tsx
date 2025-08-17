import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import EmojiProperty from "@/roles-config-editor-2/components/properties/primitive/emoji.tsx";
import { SelectMenuChoiceData } from "@/roles-config-editor-2/types/components.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function SelectMenuChoiceProperties({
  choice,
  controls,
}: {
  choice: SelectMenuChoiceData;
  controls: Controls<SelectMenuChoiceData>;
}) {
  function onRoleNameChange(value: string) {
    controls.update({
      ...choice,
      roleName: value,
    });
  }

  function onLabelChange(value: string) {
    controls.update({
      ...choice,
      label: value,
    });
  }

  function onDescriptionChange(value: string) {
    controls.update({
      ...choice,
      description: value,
    });
  }

  function onEmojiChange(value: string | null) {
    controls.update({
      ...choice,
      emoji: value,
    });
  }

  return (
    <>
      <SingleLineProperty
        label="Role name (100 characters max)"
        placeholder="Role name"
        description="The role toggled by this choice, it will be created if it does not exist"
        defaultValue={choice.roleName}
        onChange={onRoleNameChange}
      />
      <SingleLineProperty
        label="Label (100 characters max)"
        placeholder="Choice label"
        defaultValue={choice.label}
        onChange={onLabelChange}
      />
      <SingleLineProperty
        label="Description - Optional (100 characters max)"
        placeholder="Choice description"
        defaultValue={choice.description ?? ""}
        onChange={onDescriptionChange}
      />
      <EmojiProperty
        label="Emoji - Optional"
        defaultValue={choice.emoji}
        onChange={onEmojiChange}
      />
    </>
  );
}
