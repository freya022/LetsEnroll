import { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { getPanelElement } from "react-resizable-panels";
import Message from "@/roles-config-editor-2/components/display/message.tsx";
import SelectMenuChoiceProperties from "@/roles-config-editor-2/components/properties/select-menu-choice.tsx";
import SelectMenuProperties from "@/roles-config-editor-2/components/properties/select-menu.tsx";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";

export default function RolesConfigEditor() {
  useEffect(() => {
    const topPanelElement = getPanelElement("panel-1");
    const bottomPanelElement = getPanelElement("panel-2");

    topPanelElement!.style.overflow = "auto";
    bottomPanelElement!.style.overflow = "auto";
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60}>
        <div className="h-screen overflow-auto">
          <div className="pt-4 pr-2 pb-2 pl-4">
            <Message />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="h-screen overflow-scroll">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              id="panel-1"
              defaultSize={50}
            >
              <Properties name="Select menu" onDelete={() => {}}>
                {/*<MessageProperties />*/}
                {/*<ButtonProperties />*/}
                <SelectMenuProperties />
              </Properties>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel id="panel-2">
              <Properties name="Choice">
                <SelectMenuChoiceProperties />
              </Properties>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

// function ComponentTree() {
//   return (
//     <div className="grid max-h-max items-center justify-center gap-x-1">
//       <div className="col-span-5 row-start-1 grid grid-cols-subgrid">
//         <ChevronDown className="col-start-1 size-4" />
//         <span className="col-start-2">Message #1</span>
//         <button className="col-start-3 cursor-pointer p-1">
//           <ChevronDown className="size-5" />
//         </button>
//         <button className="col-start-4 cursor-pointer p-1">
//           <ChevronUp className="size-5" />
//         </button>
//         <button className="text-destructive col-start-5 cursor-pointer p-1">
//           <Trash className="size-5" />
//         </button>
//       </div>
//
//       <div className="col-span-5 col-start-1 row-start-2 grid grid-cols-subgrid">
//         <ChevronDown className="size-4" />
//         <span className="col-start-2 ml-3">Row</span>
//         <button className="col-start-3 cursor-pointer p-1">
//           <ChevronDown className="size-5" />
//         </button>
//         <button className="col-start-4 cursor-pointer p-1">
//           <ChevronUp className="size-5" />
//         </button>
//         <button className="text-destructive col-start-5 cursor-pointer p-1">
//           <Trash className="size-5" />
//         </button>
//       </div>
//       <div className="col-span-5 col-start-1 row-start-3 grid grid-cols-subgrid">
//         <ChevronDown className="size-4" />
//         <span className="col-start-2 ml-6">Button</span>
//         <button className="col-start-3 cursor-pointer p-1">
//           <ChevronDown className="size-5" />
//         </button>
//         <button className="col-start-4 cursor-pointer p-1">
//           <ChevronUp className="size-5" />
//         </button>
//         <button className="text-destructive col-start-5 cursor-pointer p-1">
//           <Trash className="size-5" />
//         </button>
//       </div>
//     </div>
//   );
// }
