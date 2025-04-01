import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { PathString } from "react-hook-form";
import { useFormCollapsibleCallbacks } from "@/roles-config-editor/contexts.ts";

export function ConfigCollapsible({
  objectPath,
  header,
  listName,
  children,
}: {
  objectPath: PathString;
  header: ReactNode;
  listName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useFormCollapsibleValidationCallback(objectPath, setOpen);

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
      <CollapsibleContent
        className={cn({
          "data-[state=closed]:hidden": "hidden", // Hide content when closed
          "data-[state=open]:block": "block", // Show content when open
        })}
        forceMount // Ensure always mounted (not removed when closed)
      >
        <Separator />
        <div className="flex flex-col items-stretch gap-y-2 px-3 py-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Configures a callback in {@link useFormCollapsibleCallbacks}
 * which calls `setOpen(true)` if there is a validation error in it or one of its children,
 * or `setOpen(false)` otherwise.
 */
function useFormCollapsibleValidationCallback(
  objectPath: string,
  setOpen: (open: boolean) => void,
) {
  const formCollapsibleCallbacks = useFormCollapsibleCallbacks();

  useEffect(() => {
    formCollapsibleCallbacks.set(objectPath, (errors) =>
      setOpen(hasError(objectPath, "messages", errors.messages)),
    );

    return () => {
      formCollapsibleCallbacks.delete(objectPath);
    };
  }, [formCollapsibleCallbacks, objectPath, setOpen]);
}

function hasError(
  objectPath: PathString,
  currPath: PathString,
  errors: unknown,
): boolean {
  if (errors instanceof Array) {
    // @ts-expect-error dw bro
    if (errors["root"] !== undefined) {
      return currPath.startsWith(objectPath);
    }

    return errors.some((nestedError, index) => {
      const nestedPath = currPath + "." + index;
      return hasError(objectPath, nestedPath, nestedError);
    });
  } else if (errors instanceof Object) {
    return Object.entries(errors).some(([key, value]) => {
      const nestedPath = currPath + "." + key;

      if (value["type"] !== undefined) {
        return nestedPath.startsWith(objectPath);
      }

      return hasError(objectPath, nestedPath, value);
    });
  } else {
    return false;
  }
}
