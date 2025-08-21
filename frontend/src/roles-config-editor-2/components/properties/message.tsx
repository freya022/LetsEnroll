import MultiLineProperty from "@/roles-config-editor-2/components/properties/primitive/multi-line.tsx";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { findDraftObj } from "@/roles-config-editor-2/utils/identifiable.ts";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";

export default function MessagePropertiesPanel({
  message,
}: {
  message: MessageData;
}) {
  const dispatch = useRolesConfigDispatch();

  function onDelete() {
    dispatch!({
      type: "delete",
      obj: message,
    });
  }

  return (
    <Properties name="Message" onDelete={onDelete}>
      <MessageProperties message={message} />
    </Properties>
  );
}

function MessageProperties({ message }: { message: MessageData }) {
  const dispatch = useRolesConfigDispatch();

  function onContentChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (findDraftObj(draft, message)!.element.content = value),
    });
  }

  return (
    <MultiLineProperty
      label="Content"
      placeholder="Message content"
      defaultValue={message.content}
      onChange={onContentChange}
    />
  );
}
