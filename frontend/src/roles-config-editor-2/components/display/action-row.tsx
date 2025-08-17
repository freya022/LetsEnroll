import {
  ComponentData,
  RowData,
} from "@/roles-config-editor-2/types/components.ts";
import { replaceIdentifiable } from "@/roles-config-editor-2/utils/identifiable.ts";
import AddRowComponentDropdown from "@/roles-config-editor-2/components/display/add-row-component-dropdown.tsx";
import Component from "@/roles-config-editor-2/components/display/component.tsx";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

export default function ActionRow({
  row,
                                    controls,
}: {
  row: RowData;
  controls: Controls<RowData>;
}) {
  function onComponentChange(c: ComponentData) {
    controls.update({
      ...row,
      components: replaceIdentifiable(row.components, c),
    });
  }

  const rowControls: Controls<ComponentData> = {
    update: onComponentChange
  }

  return (
    <li className="flex flex-wrap gap-x-2 gap-y-1">
      {row.components.map((rowComponent) => (
        <Component
          component={rowComponent}
          controls={rowControls}
          key={rowComponent.id}
        />
      ))}
      {canInsertMore(row.components) && <AddRowComponentDropdown />}
    </li>
  );
}

function canInsertMore(components: ComponentData[]): boolean {
  if (components.length >= 1 && components[0].type === "string_select_menu")
    return false;

  return components.length < 5;
}
