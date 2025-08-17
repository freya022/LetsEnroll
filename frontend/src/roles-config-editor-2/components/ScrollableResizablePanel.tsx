import { ResizablePanel } from "@/components/ui/resizable.tsx";
import { ComponentProps, useEffect, useId } from "react";
import { getPanelElement } from "react-resizable-panels";

export default function ScrollableResizablePanel(
  props: ComponentProps<typeof ResizablePanel>,
) {
  const panelId = useId();

  useEffect(() => {
    getPanelElement(panelId)!.style.overflow = "auto";
  }, [panelId]);

  return <ResizablePanel id={panelId} {...props} />;
}
