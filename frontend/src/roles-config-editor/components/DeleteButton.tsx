import { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function DeleteButton({
  name,
  onDelete,
}: {
  name: ReactNode;
  onDelete: () => void;
}) {
  // TODO Add confirmation dialog
  return (
    <Button
      type="button"
      className="w-min cursor-pointer"
      variant="destructive"
      onClick={onDelete}
    >
      <Trash2 className="size-4" />
      Delete {name}
    </Button>
  );
}
