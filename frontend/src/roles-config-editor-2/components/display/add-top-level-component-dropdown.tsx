import AddComponentDropdown from "@/roles-config-editor-2/components/display/add-component-dropdown.tsx";
import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";

export default function AddTopLevelComponentDropdown({
  message,
}: {
  message: MessageData;
}) {
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
              fn: (draft) => {
                const row = draft.newRow(draft.newButton());
                draft.find(message)!.components.push(row);
              },
            });
          },
        },
        {
          label: "Select menu",
          action: (event) => {
            event.stopPropagation();

            dispatch!({
              type: "edit",
              fn: (draft) => {
                const row = draft.newRow(draft.newSelectMenu());
                draft.find(message)!.components.push(row);
              },
            });
          },
        },
      ]}
    />
  );
}
