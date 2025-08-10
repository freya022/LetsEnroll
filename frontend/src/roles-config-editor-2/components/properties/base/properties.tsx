import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import { Button as ButtonComponent } from "@/components/ui/button.tsx";
import { Trash } from "lucide-react";

export default function Properties({
  name,
  className,
  onDelete,
  children,
}: {
  name: string;
  className?: string;
  onDelete?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-xs flex-col gap-y-4 px-4 py-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-center text-lg font-semibold">{name} properties</h3>
        {onDelete && (
          <ButtonComponent
            variant="destructive"
            size="sm"
            className="bg-destructive/70 cursor-pointer"
          >
            <Trash />
            <span>Delete</span>
          </ButtonComponent>
        )}
      </div>
      <div className="flex grow flex-col gap-y-4">{children}</div>
    </div>
  );
}
