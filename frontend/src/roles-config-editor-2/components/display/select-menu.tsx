import { ChevronDown } from "lucide-react";
import { MouseEvent } from "react";
import { SelectMenuData } from "@/roles-config-editor-2/types/component-data.ts";
import SelectMenuPropertiesPanels from "@/roles-config-editor-2/components/properties/select-menu.tsx";
import { useMutableSelectedNode } from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";
import { usePropertiesPanel } from "@/roles-config-editor-2/hooks/properties-panel-context.ts";

export default function SelectMenu({
  selectMenu,
}: {
  selectMenu: SelectMenuData;
}) {
  const { selectedNode, setSelectedNode } = useMutableSelectedNode();
  const propPanel = usePropertiesPanel();

  function handleSelectMenuClick(e: MouseEvent) {
    e.stopPropagation();
    setSelectedNode({
      id: selectMenu.id,
    });
  }

  return (
    <div
      className={cn(
        "bg-discord-select-menu-background border-discord-select-menu-border flex min-h-[44px] w-[400px] cursor-pointer items-center justify-between rounded-[8px] border-[0.8px] p-[8px]",
        selectedNode?.id === selectMenu.id && "outline-selected",
      )}
      role="list"
      onClick={handleSelectMenuClick}
    >
      <span className="text-sm text-discord-select-menu-placeholder-foreground">
        {selectMenu.placeholder || "Make a selection"}
      </span>
      <ChevronDown className="size-4" aria-hidden="true" />
      {selectedNode?.id === selectMenu.id &&
        propPanel &&
        createPortal(
          <SelectMenuPropertiesPanels selectMenu={selectMenu} />,
          propPanel,
        )}
    </div>
  );
}
