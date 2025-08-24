import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import EmojiProperty from "@/roles-config-editor-2/components/properties/primitive/emoji.tsx";
import { SelectMenuChoiceData } from "@/roles-config-editor-2/types/component-data.ts";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { ResizableHandle } from "@/components/ui/resizable.tsx";
import ScrollableResizablePanel from "@/roles-config-editor-2/components/scrollable-resizable-panel.tsx";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";

export default function SelectMenuChoicePanel({
  choice,
}: {
  choice: SelectMenuChoiceData;
}) {
  const dispatch = useRolesConfigDispatch();

  function onDelete() {
    dispatch!({
      type: "delete",
      obj: choice,
    });
  }

  return (
    <>
      <ResizableHandle />
      <ScrollableResizablePanel order={1}>
        <Properties name="Choice" onDelete={onDelete}>
          <SelectMenuChoiceProperties
            choice={choice}
            /* So the fields are reset on each choice */
            key={choice.id}
          />
        </Properties>
      </ScrollableResizablePanel>
    </>
  );
}

function SelectMenuChoiceProperties({
  choice,
}: {
  choice: SelectMenuChoiceData;
}) {
  const dispatch = useRolesConfigDispatch();

  function onRoleNameChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(choice)!.roleName = value),
    });
  }

  function onLabelChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(choice)!.label = value),
    });
  }

  function onDescriptionChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(choice)!.description = value),
    });
  }

  function onEmojiChange(value: string | null) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(choice)!.emoji = value),
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
