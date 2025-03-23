import { Lens } from "@hookform/lenses";
import { Row } from "@/dto/RolesConfigDTO.ts";
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

export function RowEditor({ rowLens }: { rowLens: Lens<Row> }) {
  const componentsLens = rowLens.focus("components");

  const { fields: componentFields, append: appendComponent } = useFieldArray({
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

  function handleCreateSelectMenu() {}

  return (
    <div>
      <div>Row</div>
      {components.length == 0 && (
        <FormMessage>A row must have at least one component</FormMessage>
      )}
      {componentFields.map((component, componentIndex) => {
        return (
          <ComponentEditor
            componentLens={componentsLens.focus(`${componentIndex}`)}
            component={component}
            key={component.id}
          />
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="secondary">
            New component...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleCreateButton}>
            Button
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCreateSelectMenu}>
            Select menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
