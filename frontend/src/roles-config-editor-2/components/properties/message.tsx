import MultiLineProperty from "@/roles-config-editor-2/components/properties/primitive/multi-line.tsx";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function MessageProperties({
  message,
  controls,
}: {
  message: MessageData;
  controls: Controls<MessageData>;
}) {
  return (
    <MultiLineProperty
      label="Content"
      placeholder="Message content"
      defaultValue={message.content}
      onChange={(value: string) => {
        controls.update({
          ...message,
          content: value,
        });
      }}
    />
  );
}
