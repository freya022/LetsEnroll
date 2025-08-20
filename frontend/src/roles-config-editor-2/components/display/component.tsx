import { ReactNode } from "react";
import ActionRow from "@/roles-config-editor-2/components/display/action-row.tsx";
import Button from "@/roles-config-editor-2/components/display/button.tsx";
import SelectMenu from "@/roles-config-editor-2/components/display/select-menu.tsx";
import { ComponentData } from "@/roles-config-editor-2/types/component-data.ts";

export default function Component({
  component,
}: {
  component: ComponentData;
}): ReactNode {
  switch (component.type) {
    case "row":
      return <ActionRow row={component} />;
    case "button":
      return <Button button={component} hasError={false} />;
    case "string_select_menu":
      return <SelectMenu selectMenu={component} />;
  }
}
