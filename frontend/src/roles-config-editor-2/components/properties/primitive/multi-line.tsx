import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useRef } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function MultiLineProperty({
  path,
  label,
  placeholder,
}: {
  path: string;
  label: string;
  placeholder: string;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  return (
    <Property>
      <Label onClick={() => textAreaRef.current?.focus()} htmlFor={path}>
        {label}
      </Label>
      <Textarea placeholder={placeholder} ref={textAreaRef} id={path} />
    </Property>
  );
}
