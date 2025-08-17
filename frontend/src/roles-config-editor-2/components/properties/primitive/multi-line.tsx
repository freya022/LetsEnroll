import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useId, useState } from "react";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function MultiLineProperty({
  label,
  placeholder,
  defaultValue,
  onChange,
}: {
  label: string;
  placeholder: string;
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  const id = useId()
  const [value, setValue] = useState(defaultValue);

  return (
    <Property>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        id={id}
      />
    </Property>
  );
}
