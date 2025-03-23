import { Lens } from "@hookform/lenses";
import { Button, Component, Row, SelectMenu } from "@/dto/RolesConfigDTO.ts";
import { RowEditor } from "@/roles-config-editor/components/RowEditor.tsx";
import { ButtonEditor } from "@/roles-config-editor/components/ButtonEditor.tsx";
import { SelectMenuEditor } from "@/roles-config-editor/components/SelectMenuEditor.tsx";

export function ComponentEditor({
  componentLens,
  component,
}: {
  componentLens: Lens<Component>;
  component: Component;
}) {
  if (component.type === "button") {
    return <ButtonEditor buttonLens={componentLens as Lens<Button>} />;
  } else if (component.type === "string_select_menu") {
    return (
      <SelectMenuEditor selectMenuLens={componentLens as Lens<SelectMenu>} />
    );
  } else if (component.type === "row") {
    return <RowEditor rowLens={componentLens as Lens<Row>} />;
  }
}
