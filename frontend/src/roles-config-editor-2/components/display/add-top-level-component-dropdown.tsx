import AddComponentDropdown from "@/roles-config-editor-2/components/display/add-component-dropdown.tsx";

export default function AddTopLevelComponentDropdown() {
  return (
    <AddComponentDropdown
      label="Add top-level component..."
      items={[
        {
          label: "Row",
          action: () => {
            console.log("row");
          },
        },
      ]}
    />
  );
}
