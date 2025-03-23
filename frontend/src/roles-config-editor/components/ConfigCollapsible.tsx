import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { ReactNode, useState } from "react";

export function ConfigCollapsible({
  header,
  listName,
  children,
}: {
  header: ReactNode;
  listName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex flex-col rounded-lg border-2"
    >
      <CollapsibleTrigger className="flex w-full justify-between" asChild>
        <Button
          type="button"
          variant="ghost"
          className={`cursor-pointer ${open ? "rounded-b-none" : ""}`}
        >
          <span>{header}</span>
          {open ? <ChevronUp /> : <ChevronDown />}
          <span className="sr-only">Toggle {listName.toLowerCase()}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Separator />
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
