import AddComponentDropdown from "@/roles-config-editor-2/components/display/add-component-dropdown.tsx";

export default function AddRowComponentDropdown() {
  return (
    <AddComponentDropdown
      label="Add component..."
      items={[
        {
          label: "Toggle button",
          action: () => {
            console.log("button");
          },
        },
      ]}
    />
  );
}
