import { useRouteLoaderData } from "react-router";
import { UserDTO } from "@/dto/UserDTO.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { getAvatarUrl } from "@/utils/user.ts";
import Components from "@/roles-config-editor-2/components/display/components.tsx";
import AddTopLevelComponentDropdown from "@/roles-config-editor-2/components/display/add-top-level-component-dropdown.tsx";
import Component from "@/roles-config-editor-2/components/display/component.tsx";
import { useMutableSelectedNode } from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import { cn } from "@/lib/utils.ts";
import MessagePropertiesPanel from "@/roles-config-editor-2/components/properties/message.tsx";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { createPortal } from "react-dom";
import { usePropertiesPanel } from "@/roles-config-editor-2/hooks/properties-panel-context.ts";

const MAX_COMPONENT_COUNT = 5;

export default function Message({ message }: { message: MessageData }) {
  const { user } = useRouteLoaderData<{ user: UserDTO }>("root")!;
  const { selectedNode, setSelectedNode } = useMutableSelectedNode();
  const propPanel = usePropertiesPanel();

  // TODO a better (?) selection system could be a single listener
  //  using "data" attributes in elements, setting the selected node to that ID,
  //  then the corresponding node responds to it by setting the properties
  //  When an user clicks somewhere, collect all the intersecting IDs,
  //  if it corresponds to the "old" cycle set, then cycle through,
  //  if not, update cycle set and select nearest
  function handleMessageClick() {
    setSelectedNode({
      id: message.id,
    });
  }

  return (
    <div
      className={cn(
        "flex gap-4",
        selectedNode?.id === message.id &&
          "outline-ring rounded-sm outline-2 outline-offset-1",
      )}
      onClick={handleMessageClick}
    >
      <Avatar className="mt-0.5">
        <AvatarImage
          src={getAvatarUrl(user)}
          alt={`Avatar of ${user.effectiveName}`}
        />
      </Avatar>
      <div className="select-none">
        <div>
          <span>{user.effectiveName}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          <span>{message.content}</span>
          <Components>
            {message.components.map((component) => (
              <Component component={component} key={component.id} />
            ))}
            {message.components.length < MAX_COMPONENT_COUNT && (
              <AddTopLevelComponentDropdown message={message} />
            )}
          </Components>
        </div>
      </div>
      {selectedNode?.id == message.id &&
        propPanel &&
        createPortal(<MessagePropertiesPanel message={message} />, propPanel)}
    </div>
  );
}
