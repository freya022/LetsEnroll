import { useRef } from "react";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import PropertyDescription from "@/roles-config-editor-2/components/properties/base/property-description.tsx";

export default function SingleLineProperty({
  path,
  label,
  placeholder,
  description,
}: {
  path: string;
  label: string;
  placeholder: string;
  description?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Property>
      <Label onClick={() => inputRef.current?.focus()} htmlFor={path}>
        {label}
      </Label>
      <Input type="text" placeholder={placeholder} ref={inputRef} id={path} />
      {description && <PropertyDescription description={description} />}
    </Property>
  );
}
