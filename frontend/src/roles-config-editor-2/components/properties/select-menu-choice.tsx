import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import EmojiProperty from "@/roles-config-editor-2/components/properties/primitive/emoji.tsx";

export default function SelectMenuChoiceProperties() {
  return (
    <>
      <SingleLineProperty
        label="Role name (100 characters max)"
        placeholder="Role name"
        description="The role toggled by this choice, it will be created if it does not exist"
        path="message.0.components.0.components.0.choices.0.role_name"
      />
      <SingleLineProperty
        label="Label (100 characters max)"
        placeholder="Choice label"
        path="message.0.components.0.components.0.choices.0.label"
      />
      <SingleLineProperty
        label="Description - Optional (100 characters max)"
        placeholder="Choice description"
        path="message.0.components.0.components.0.choices.0.description"
      />
      <EmojiProperty
        label="Emoji - Optional"
        path="message.0.components.0.components.0.choices.0.emoji"
      />
    </>
  );
}
