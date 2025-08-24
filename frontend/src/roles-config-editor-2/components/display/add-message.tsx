import { useRolesConfigDispatch } from "@/roles-config-editor-2/hooks/roles-config-context.ts";

export default function AddMessage() {
  const dispatch = useRolesConfigDispatch();

  function handleAddMessage() {
    dispatch!({
      type: "add_message",
    });
  }

  return (
    <button
      onClick={handleAddMessage}
      className="flex h-16 w-md cursor-pointer items-center justify-center rounded-[8px] border-[2px] border-dashed border-gray-600 px-[11px] py-[3px]"
    >
      <span className="text-sm">Add message</span>
    </button>
  );
}
