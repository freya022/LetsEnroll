import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import { cn } from "@/lib/utils.ts";
import { ChevronDown, ChevronUp, X } from "lucide-react";

export default function SelectMenuProperties() {
  return (
    <>
      <SingleLineProperty
        label="Placeholder - Optional (100 characters max)"
        placeholder="Placeholder"
        path="message.0.components.0.components.0.placeholder"
      />
      <div>
        <h3 className="text-center text-lg font-semibold">Choices</h3>
        <SelectMenuChoices />
      </div>
    </>
  );
}

function SelectMenuChoices() {
  return (
    <div className="border-accent grid border-2">
      <SelectMenuChoiceItem selected={true} />
      <SelectMenuChoiceItem selected={false} />
      <SelectMenuChoiceItem selected={false} />
      <SelectMenuChoiceItem selected={false} />
    </div>
  );
}

function SelectMenuChoiceItem({ selected }: { selected: boolean }) {
  return (
    <div
      className={cn(
        "odd:bg-accent/60 flex *:h-full *:py-0.5",
        selected && "outline-ring outline-1",
      )}
    >
      <span className="grow border-r-2 pl-1">Choice label</span>
      <ChevronDown className="hover:bg-accent cursor-pointer border-r-2" />
      <ChevronUp className="hover:bg-accent cursor-pointer border-r-2" />
      <X className="text-destructive hover:bg-destructive/60 cursor-pointer" />
    </div>
  );
}
