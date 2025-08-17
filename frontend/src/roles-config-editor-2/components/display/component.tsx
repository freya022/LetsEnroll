import { ReactNode } from "react";
import ActionRow from "@/roles-config-editor-2/components/display/action-row.tsx";
import Button from "@/roles-config-editor-2/components/display/button.tsx";
import SelectMenu from "@/roles-config-editor-2/components/display/select-menu.tsx";
import { ComponentData } from "@/roles-config-editor-2/types/components.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function Component({
  component,
  controls,
}: {
  component: ComponentData;
  controls: Controls<ComponentData>;
}): ReactNode {
  switch (component.type) {
    case "row":
      return <ActionRow row={component} controls={controls} />;
    case "button":
      return <Button button={component} controls={controls} hasError={false} />;
    case "string_select_menu":
      return <SelectMenu selectMenu={component} controls={controls} />;
  }
}
