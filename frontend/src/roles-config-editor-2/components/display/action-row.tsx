import {
  ComponentData,
  RowData,
} from "@/roles-config-editor-2/types/component-data.ts";
import AddRowComponentDropdown from "@/roles-config-editor-2/components/display/add-row-component-dropdown.tsx";
import Component from "@/roles-config-editor-2/components/display/component.tsx";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { useEffect } from "react";

export default function ActionRow({ row }: { row: RowData }) {
  const dispatch = useRolesConfigDispatch()

  // Delete if empty
  useEffect(() => {
    if (row.components.length == 0) {
      dispatch!({
        type: "delete",
        obj: row,
      })
    }
  }, [row, dispatch])

  return (
    <li className="flex flex-wrap gap-x-2 gap-y-1">
      {row.components.map((rowComponent) => (
        <Component component={rowComponent} key={rowComponent.id} />
      ))}
      {canInsertMore(row.components) && <AddRowComponentDropdown row={row} />}
    </li>
  );
}

function canInsertMore(components: ComponentData[]): boolean {
  if (components.length >= 1 && components[0].type === "string_select_menu")
    return false;

  return components.length < 5;
}
