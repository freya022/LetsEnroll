import { useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import Message from "@/roles-config-editor-2/components/display/message.tsx";
import {
  MutableSelectedNodeContext,
  SelectedNode,
} from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import {
  getCustomEmojis,
  getCustomEmojisQueryKey,
} from "@/emoji-picker/queries/custom-emojis.ts";
import { useQuery } from "@tanstack/react-query";
import { useSelectedGuild } from "@/roles-config-editor/hooks/use-selected-guild.ts";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { replaceIdentifiable } from "@/roles-config-editor-2/utils/identifiable.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";
import { PropertiesPanelRefContext } from "@/roles-config-editor-2/hooks/properties-panel.ts";

const testData: RolesConfigData = {
  messages: [
    {
      id: 1,
      content: "Message content idk",
      components: [
        {
          type: "row",
          id: 2,
          components: [
            {
              type: "button",
              id: 3,
              style: "PRIMARY",
              roleName: "BC Updates",
              label: "Toggle BC update pings",
              emoji: "🔔",
            },
          ],
        },
        {
          type: "row",
          id: 4,
          components: [
            {
              type: "string_select_menu",
              id: 5,
              placeholder: "",
              choices: [
                {
                  id: 6,
                  label: "Choice label idk",
                  roleName: "Role name idk",
                  emoji: "🔥",
                  description: "Choice description idk",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function RolesConfigEditor() {
  const { id: guildId } = useSelectedGuild();

  // State
  const [data, setData] = useState(testData);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  // Prefetch custom emojis
  useQuery({
    queryKey: getCustomEmojisQueryKey(guildId),
    queryFn: async () => getCustomEmojis(guildId),
    // Optional optimization to avoid rerenders when this query changes:
    notifyOnChangeProps: [],
  });

  // Handlers
  function onMessageChange(m: MessageData) {
    setData((data) => ({
      messages: replaceIdentifiable(data.messages, m),
    }));
  }

  const messageControls: Controls<MessageData> = {
    update: onMessageChange,
  };

  // So the selected nodes can create portals to it
  const propPanelRef = useRef<HTMLDivElement | null>(null);

  return (
    <MutableSelectedNodeContext value={{ selectedNode, setSelectedNode }}>
      <PropertiesPanelRefContext value={propPanelRef}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60}>
            <div className="h-screen overflow-auto">
              <div className="pt-4 pr-2 pb-2 pl-4">
                {data.messages.map((message) => (
                  <Message
                    message={message}
                    controls={messageControls}
                    key={message.id}
                  />
                ))}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="size-full" ref={propPanelRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </PropertiesPanelRefContext>
    </MutableSelectedNodeContext>
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
