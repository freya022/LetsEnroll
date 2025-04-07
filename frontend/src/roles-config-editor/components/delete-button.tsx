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
  return (
    <Button
      type="button"
      className="w-min cursor-pointer bg-destructive/70"
      variant="destructive"
      onClick={() => {
        // TODO in-app alert dialog https://ui.shadcn.com/docs/components/alert-dialog
        const canDelete = confirm(`Are you sure you want to delete this ${name}?`);
        if (canDelete)
          onDelete();
      }}
    >
      <Trash2 className="size-4" />
      Delete {name}
    </Button>
  );
}
