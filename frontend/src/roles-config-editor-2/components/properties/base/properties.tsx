import { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Trash } from "lucide-react";

export default function Properties({
  name,
  onDelete,
  children,
}: {
  name: string;
  onDelete: () => void;
  children: ReactNode;
}) {
  return (
    <div className={"flex min-w-xs flex-col gap-y-4 px-4 py-2"}>
      <div className="flex items-center justify-between">
        <h3 className="text-center text-lg font-semibold">{name} properties</h3>
        <Button
          variant="destructive"
          size="sm"
          className="bg-destructive/70 cursor-pointer"
          onClick={onDelete}
        >
          <Trash aria-hidden={true} />
          <span>Delete</span>
        </Button>
      </div>
      <div className="flex grow flex-col gap-y-4">{children}</div>
    </div>
  );
}
