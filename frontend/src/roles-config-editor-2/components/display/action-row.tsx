import {
  ComponentData,
  RowData,
} from "@/roles-config-editor-2/types/components.ts";
import AddRowComponentDropdown from "@/roles-config-editor-2/components/display/add-row-component-dropdown.tsx";
import Component from "@/roles-config-editor-2/components/display/component.tsx";

export default function ActionRow({ row }: { row: RowData }) {
  return (
    <li className="flex flex-wrap gap-x-2 gap-y-1">
      {row.components.map((rowComponent) => (
        <Component component={rowComponent} key={rowComponent.id} />
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
