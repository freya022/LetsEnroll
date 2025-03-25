import { Lens } from "@hookform/lenses";
import {
  Button,
  Component,
  Row,
  SelectMenu,
  SelectMenuChoice,
} from "@/dto/RolesConfigDTO.ts";
import { RowEditor } from "@/roles-config-editor/components/RowEditor.tsx";
import { ButtonEditor } from "@/roles-config-editor/components/ButtonEditor.tsx";
import { SelectMenuEditor } from "@/roles-config-editor/components/SelectMenuEditor.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/ConfigCollapsible.tsx";
import { useWatch } from "react-hook-form";
import { FormMessage } from "@/components/ui/form.tsx";

export function ComponentEditor({
  componentLens,
}: {
  componentLens: Lens<Component>;
}) {
  const component = useWatch({
    name: componentLens.interop().name,
    control: componentLens.interop().control,
  });

  if (component.type === "button") {
    const button = component as Button;
    return (
      <ConfigCollapsible
        header={
          button.roleName.trim().length === 0 ? (
            <FormMessage>Button - Not configured yet</FormMessage>
          ) : (
            `Toggle for '${button.roleName}'`
          )
        }
        listName="button config"
      >
        <ButtonEditor buttonLens={componentLens as Lens<Button>} />
      </ConfigCollapsible>
    );
  } else if (component.type === "string_select_menu") {
    const selectMenu = component as SelectMenu;
    return (
      <ConfigCollapsible
        header={
          !hasRoleNamesSet(selectMenu.choices) ? (
            <FormMessage>Select menu - Not configured yet</FormMessage>
          ) : (
            `Menu of ${selectMenu.choices.length} roles`
          )
        }
        listName="select menu config"
      >
        <SelectMenuEditor selectMenuLens={componentLens as Lens<SelectMenu>} />
      </ConfigCollapsible>
    );
  } else if (component.type === "row") {
    const row = component as Row;
    return (
      <ConfigCollapsible
        header={
          row.components.length === 0 ? (
            <FormMessage>Row - Not configured yet</FormMessage>
          ) : (
            `Row of ${row.components.length} components`
          )
        }
        listName="row config"
      >
        <RowEditor rowLens={componentLens as Lens<Row>} />
      </ConfigCollapsible>
    );
  }
}

function hasRoleNamesSet(choices: SelectMenuChoice[]): boolean {
  return (
    choices.length !== 0 && choices.every((c) => c.roleName.trim().length > 0)
  );
}
