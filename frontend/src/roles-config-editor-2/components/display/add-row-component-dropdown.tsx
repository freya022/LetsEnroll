import AddComponentDropdown from "@/roles-config-editor-2/components/display/add-component-dropdown.tsx";

export default function AddRowComponentDropdown() {
  return (
    <AddComponentDropdown
      label="Add row component..."
      items={[
        {
          label: "Toggle button",
          action: () => {
            console.log("button");
          },
        },
        {
          label: "Select menu",
          action: () => {
            console.log("select menu");
          },
        },
      ]}
    />
  );
}
