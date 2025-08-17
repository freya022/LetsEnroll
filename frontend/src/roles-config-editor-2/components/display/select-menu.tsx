import { ChevronDown } from "lucide-react";
import { MouseEvent, useState } from "react";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";
import {
  SelectMenuChoiceData,
  SelectMenuData,
} from "@/roles-config-editor-2/types/components.ts";
import SelectMenuChoiceProperties from "@/roles-config-editor-2/components/properties/select-menu-choice.tsx";
import SelectMenuProperties from "@/roles-config-editor-2/components/properties/select-menu.tsx";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";
import { replaceIdentifiable } from "@/roles-config-editor-2/utils/identifiable.ts";
import { useMutableSelectedNode } from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import ScrollableResizablePanel from "@/roles-config-editor-2/components/ScrollableResizablePanel.tsx";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";
import { usePropertiesPanel } from "@/roles-config-editor-2/hooks/properties-panel.ts";

export default function SelectMenu({
  selectMenu,
  controls,
}: {
  selectMenu: SelectMenuData;
  controls: Controls<SelectMenuData>;
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
        "flex min-h-[44px] w-[400px] cursor-pointer items-center justify-between rounded-[8px] border-[0.8px] bg-[#18181c] p-[8px]",
        selectedNode?.id === selectMenu.id &&
          "outline-ring outline-2 outline-offset-1",
      )}
      role="list"
      onClick={handleSelectMenuClick}
    >
      <span className="text-sm text-[#a8abb1]">
        {selectMenu.placeholder || "Make a selection"}
      </span>
      <ChevronDown className="size-4" aria-hidden="true" />
      {selectedNode?.id === selectMenu.id &&
        propPanel &&
        createPortal(
          <SelectMenuPropertiesPanels
            selectMenu={selectMenu}
            controls={controls}
          />,
          propPanel,
        )}
    </div>
  );
}

function SelectMenuPropertiesPanels({
  selectMenu,
  controls,
}: {
  selectMenu: SelectMenuData;
  controls: Controls<SelectMenuData>;
}) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number>();
  const selectedChoice = selectMenu.choices.find(
    (c) => c.id === selectedChoiceId,
  );

  return (
    <ResizablePanelGroup direction="vertical">
      <ScrollableResizablePanel order={0} defaultSize={selectedChoice && 50}>
        <Properties name="Select menu" onDelete={() => {}}>
          <SelectMenuProperties
            menu={selectMenu}
            controls={controls}
            selectedChoiceId={selectedChoiceId}
            setSelectedChoiceId={setSelectedChoiceId}
          />
        </Properties>
      </ScrollableResizablePanel>
      {selectedChoice && (
        <SelectMenuChoicePanel
          choice={selectedChoice}
          controls={getChoiceControls(selectMenu, controls)}
        />
      )}
    </ResizablePanelGroup>
  );
}

function getChoiceControls(
  parent: SelectMenuData,
  parentControls: Controls<SelectMenuData>,
): Controls<SelectMenuChoiceData> {
  function onChoiceUpdate(choice: SelectMenuChoiceData) {
    parentControls.update({
      ...parent,
      choices: replaceIdentifiable(parent.choices, choice),
    });
  }

  return {
    update: onChoiceUpdate,
  };
}

function SelectMenuChoicePanel({
  choice,
  controls,
}: {
  choice: SelectMenuChoiceData;
  controls: Controls<SelectMenuChoiceData>;
}) {
  return (
    <>
      <ResizableHandle />
      <ScrollableResizablePanel order={1}>
        <Properties name="Choice">
          <SelectMenuChoiceProperties choice={choice} controls={controls} />
        </Properties>
      </ScrollableResizablePanel>
    </>
  );
}
