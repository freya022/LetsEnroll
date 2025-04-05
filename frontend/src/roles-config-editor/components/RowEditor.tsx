import { Lens } from "@hookform/lenses";
import { Component, Row } from "@/dto/RolesConfigDTO.ts";
import { useFieldArray, useWatch } from "react-hook-form";
import { FormMessage } from "@/components/ui/form.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ComponentEditor } from "@/roles-config-editor/components/ComponentEditor.tsx";
import DeleteButton from "@/roles-config-editor/components/DeleteButton.tsx";

export function RowEditor({
  rowLens,
  onRowDelete,
}: {
  rowLens: Lens<Row>;
  onRowDelete: () => void;
}) {
  const componentsLens = rowLens.focus("components");

  const {
    fields: componentFields,
    append: appendComponent,
    remove: removeComponent,
  } = useFieldArray({
    ...componentsLens.interop(),
    rules: {
      required: true,
    },
  });

  const components = useWatch({
    name: componentsLens.interop().name,
    control: componentsLens.interop().control,
  });

  function handleCreateButton() {
    appendComponent({
      type: "button",
      roleName: "",
      style: "PRIMARY",
      label: null,
      emoji: null,
    });
  }

  function handleCreateSelectMenu() {
    appendComponent({
      type: "string_select_menu",
      placeholder: null,
      choices: [],
    });
  }

  return (
    <>
      {componentFields.map((component, componentIndex) => {
        return (
          <ComponentEditor
            componentLens={componentsLens.focus(`${componentIndex}`)}
            key={component.id}
            onComponentDelete={() => removeComponent(componentIndex)}
          />
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            disabled={!canInsertMore(components)}
          >
            New component...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleCreateButton}>
            Button
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={handleCreateSelectMenu}
            disabled={components.length > 0}
          >
            Select menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {components.length < 1 && (
        <FormMessage>A row must have at least one component</FormMessage>
      )}
      <DeleteButton name={"Row"} onDelete={onRowDelete} />
    </>
  );
}

function canInsertMore(components: Component[]): boolean {
  if (components.length >= 1 && components[0].type === "string_select_menu")
    return false;

  return components.length < 5;
}
