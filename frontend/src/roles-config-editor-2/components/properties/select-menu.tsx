import SingleLineProperty from "@/roles-config-editor-2/components/properties/primitive/single-line.tsx";
import { cn } from "@/lib/utils.ts";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  SelectMenuChoiceData,
  SelectMenuData,
} from "@/roles-config-editor-2/types/component-data.ts";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { useState } from "react";
import { ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import ScrollableResizablePanel from "@/roles-config-editor-2/components/scrollable-resizable-panel.tsx";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";
import SelectMenuChoicePanel from "@/roles-config-editor-2/components/properties/select-menu-choice.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function SelectMenuPropertiesPanels({
  selectMenu,
}: {
  selectMenu: SelectMenuData;
}) {
  const dispatch = useRolesConfigDispatch();

  const [selectedChoiceId, setSelectedChoiceId] = useState<number>();
  const selectedChoice = selectMenu.choices.find(
    (c) => c.id === selectedChoiceId,
  );

  function onDelete() {
    dispatch!({
      type: "delete",
      obj: selectMenu,
    });
  }

  return (
    <ResizablePanelGroup direction="vertical">
      <ScrollableResizablePanel order={0} defaultSize={selectedChoice && 50}>
        <Properties name="Select menu" onDelete={onDelete}>
          <SelectMenuProperties
            menu={selectMenu}
            selectedChoiceId={selectedChoiceId}
            setSelectedChoiceId={setSelectedChoiceId}
          />
        </Properties>
      </ScrollableResizablePanel>
      {selectedChoice && <SelectMenuChoicePanel choice={selectedChoice} />}
    </ResizablePanelGroup>
  );
}

function SelectMenuProperties({
  menu,
  selectedChoiceId,
  setSelectedChoiceId,
}: {
  menu: SelectMenuData;
  selectedChoiceId: number | undefined;
  setSelectedChoiceId: (choiceId: number) => void;
}) {
  const dispatch = useRolesConfigDispatch();

  function onPlaceholderChange(value: string) {
    dispatch!({
      type: "edit",
      fn: (draft) => (draft.find(menu)!.placeholder = value),
    });
  }

  function onAddChoice() {
    dispatch!({
      type: "edit",
      fn: (draft) => {
        draft.find(menu)!.choices.push(draft.newSelectMenuChoice());
      },
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
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Choices</h3>
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={onAddChoice}
          >
            Add
          </Button>
        </div>
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
      {choices.map((choice, index) => (
        <SelectMenuChoiceItem
          choice={choice}
          index={index}
          maxIndex={choices.length}
          setSelectedChoiceId={setSelectedChoiceId}
          selected={selectedChoiceId === choice.id}
          key={choice.id}
        />
      ))}
    </div>
  );
}

function SelectMenuChoiceItem({
  choice,
  index,
  maxIndex,
  setSelectedChoiceId,
  selected,
}: {
  choice: SelectMenuChoiceData;
  index: number;
  maxIndex: number;
  setSelectedChoiceId: (choiceId: number) => void;
  selected: boolean;
}) {
  const dispatch = useRolesConfigDispatch();

  const canMoveUp = index !== 0;
  const canMoveDown = index !== maxIndex - 1;

  function handleToggle() {
    setSelectedChoiceId(choice.id);
  }

  function handleMoveUp() {
    dispatch!({
      type: "swap",
      item: choice,
      newPosition: index - 1,
    });
  }

  function handleMoveDown() {
    dispatch!({
      type: "swap",
      item: choice,
      newPosition: index + 1,
    });
  }

  function handleDelete() {
    dispatch!({
      type: "delete",
      obj: choice,
    });
  }

  return (
    <div
      className={cn(
        "odd:bg-accent/60 flex *:h-full *:py-0.5",
        selected && "outline-ring outline-1",
      )}
    >
      <span
        className="hover:bg-accent grow cursor-pointer border-r-2 pl-1 select-none"
        onClick={handleToggle}
      >
        {choice.label}
      </span>
      <button
        className="hover:bg-accent cursor-pointer border-r-2 disabled:pointer-events-none disabled:opacity-50"
        onClick={handleMoveDown}
        disabled={!canMoveDown}
        aria-label="Move down"
      >
        <ChevronDown aria-hidden={true} />
      </button>
      <button
        className="hover:bg-accent cursor-pointer border-r-2 disabled:pointer-events-none disabled:opacity-50"
        onClick={handleMoveUp}
        disabled={!canMoveUp}
        aria-label="Move up"
      >
        <ChevronUp aria-hidden={true} />
      </button>
      <button
        className="text-destructive hover:bg-destructive/60 cursor-pointer"
        onClick={handleDelete}
      >
        <X aria-hidden={true} />
      </button>
    </div>
  );
}
