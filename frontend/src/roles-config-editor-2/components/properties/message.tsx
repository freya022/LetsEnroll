import MultiLineProperty from "@/roles-config-editor-2/components/properties/primitive/multi-line.tsx";

export default function MessageProperties() {
  return (
    <MultiLineProperty
      label="Content"
      placeholder="Message content"
      path="message.0.content"
    />
  );
}
