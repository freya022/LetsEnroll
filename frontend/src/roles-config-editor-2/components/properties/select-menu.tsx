import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import { cn } from "@/lib/utils.ts";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  SelectMenuChoiceData,
  SelectMenuData,
} from "@/roles-config-editor-2/types/components.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function SelectMenuProperties({
  menu,
  controls,
  selectedChoiceId,
  setSelectedChoiceId,
}: {
  menu: SelectMenuData;
  controls: Controls<SelectMenuData>;
  selectedChoiceId: number | undefined;
  setSelectedChoiceId: (choiceId: number) => void;
}) {
  function onPlaceholderChange(value: string) {
    controls.update({
      ...menu,
      placeholder: value,
    });
  }

  return (
    <>
      <SingleLineProperty
        label="Placeholder - Optional (100 characters max)"
        placeholder="Placeholder"
        defaultValue={menu.placeholder ?? ""}
        onChange={onPlaceholderChange}
      />
      <div>
        <h3 className="text-center text-lg font-semibold">Choices</h3>
        <SelectMenuChoices
          choices={menu.choices}
          selectedChoiceId={selectedChoiceId}
          setSelectedChoiceId={setSelectedChoiceId}
        />
      </div>
    </>
  );
}

function SelectMenuChoices({
  choices,
  selectedChoiceId,
  setSelectedChoiceId,
}: {
  choices: SelectMenuChoiceData[];
  selectedChoiceId: number | undefined;
  setSelectedChoiceId: (choiceId: number) => void;
}) {
  return (
    <div className="border-accent grid rounded-sm border-2 *:first:rounded-t-sm *:last:rounded-b-sm">
      {choices.map((choice) => (
        <SelectMenuChoiceItem
          choice={choice}
          selected={selectedChoiceId === choice.id}
          onToggle={() => setSelectedChoiceId(choice.id)}
          key={choice.id}
        />
      ))}
    </div>
  );
}

function SelectMenuChoiceItem({
  choice,
  selected,
  onToggle,
}: {
  choice: SelectMenuChoiceData;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "odd:bg-accent/60 flex *:h-full *:py-0.5",
        selected && "outline-ring outline-1",
      )}
      onClick={onToggle}
    >
      <span className="hover:bg-accent grow cursor-pointer border-r-2 pl-1 select-none">
        {choice.label}
      </span>
      <ChevronDown className="hover:bg-accent cursor-pointer border-r-2" />
      <ChevronUp className="hover:bg-accent cursor-pointer border-r-2" />
      <X className="text-destructive hover:bg-destructive/60 cursor-pointer" />
    </div>
  );
}
