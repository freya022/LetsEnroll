import { Lens } from "@hookform/lenses";
import { Button, Component, Row } from "@/dto/RolesConfigDTO.ts";
import { RowEditor } from "@/roles-config-editor/components/RowEditor.tsx";
import { ButtonEditor } from "@/roles-config-editor/components/ButtonEditor.tsx";

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
    return <div>select menu</div>;
  } else if (component.type === "row") {
    return <RowEditor rowLens={componentLens as Lens<Row>} />;
  }
}
