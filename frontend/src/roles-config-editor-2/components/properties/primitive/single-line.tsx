import { useId, useState } from "react";
import Property from "@/roles-config-editor-2/components/properties/base/property.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import PropertyDescription from "@/roles-config-editor-2/components/properties/base/property-description.tsx";

export default function SingleLineProperty({
  label,
  defaultValue,
  placeholder,
  description,
  onChange,
}: {
  label: string;
  defaultValue: string;
  placeholder: string;
  description?: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  return (
    <Property>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        id={id}
      />
      {description && <PropertyDescription description={description} />}
    </Property>
  );
}
