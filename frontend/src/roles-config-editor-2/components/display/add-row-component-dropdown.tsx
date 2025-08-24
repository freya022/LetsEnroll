import AddComponentDropdown from "@/roles-config-editor-2/components/display/add-component-dropdown.tsx";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { RowData } from "@/roles-config-editor-2/types/component-data.ts";

export default function AddRowComponentDropdown({ row }: { row: RowData }) {
  const dispatch = useRolesConfigDispatch();

  return (
    <AddComponentDropdown
      label="Add component..."
      items={[
        {
          label: "Toggle button",
          action: (event) => {
            event.stopPropagation();

            dispatch!({
              type: "edit",
              fn: (draft) =>
                draft.find(row)!.components.push(draft.newButton()),
            });
          },
        },
      ]}
    />
  );
}
