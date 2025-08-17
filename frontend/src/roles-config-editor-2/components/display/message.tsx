import { useRouteLoaderData } from "react-router";
import { UserDTO } from "@/dto/UserDTO.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { getAvatarUrl } from "@/utils/user.ts";
import Components from "@/roles-config-editor-2/components/display/components.tsx";
import AddTopLevelComponentDropdown from "@/roles-config-editor-2/components/display/add-top-level-component-dropdown.tsx";
import AddMessage from "@/roles-config-editor-2/components/display/add-message.tsx";
import Component from "@/roles-config-editor-2/components/display/component.tsx";
import { useMutableSelectedNode } from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import { cn } from "@/lib/utils.ts";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";
import MessageProperties from "@/roles-config-editor-2/components/properties/message.tsx";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { replaceIdentifiable } from "@/roles-config-editor-2/utils/identifiable.ts";
import { ComponentData } from "@/roles-config-editor-2/types/components.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";

const MAX_COMPONENT_COUNT = 5;

export default function Message({
  message,
  controls,
}: {
  message: MessageData;
  controls: Controls<MessageData>;
}) {
  const { user } = useRouteLoaderData<{ user: UserDTO }>("root")!;
  const { selectedNode, setSelectedNode } = useMutableSelectedNode();

  // TODO a better (?) selection system could be a single listener
  //  using "data" attributes in elements, setting the selected node to that ID,
  //  then the corresponding node responds to it by setting the properties
  //  When an user clicks somewhere, collect all the intersecting IDs,
  //  if it corresponds to the "old" cycle set, then cycle through,
  //  if not, update cycle set and select nearest
  function handleMessageClick() {
    setSelectedNode({
      id: message.id,
      propertiesRenderer: () => (
        <MessagePropertiesPanel message={message} controls={controls} />
      ),
    });
  }

  function onComponentChange(c: ComponentData) {
    controls.update({
      ...message,
      components: replaceIdentifiable(message.components, c),
    });
  }

  const componentsControls: Controls<ComponentData> = {
    update: onComponentChange,
  };

  return (
    <div
      className={cn(
        "flex gap-4",
        selectedNode?.id === message.id &&
          "outline-ring outline-2 outline-offset-1",
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
              <Component
                component={component}
                controls={componentsControls}
                key={component.id}
              />
            ))}
            {message.components.length < MAX_COMPONENT_COUNT && (
              <AddTopLevelComponentDropdown />
            )}
          </Components>
        </div>
        <div className="mt-1">
          <AddMessage />
        </div>
      </div>
    </div>
  );
}

function MessagePropertiesPanel({
  message,
  controls,
}: {
  message: MessageData;
  controls: Controls<MessageData>;
}) {
  return (
    <Properties name="Message" onDelete={() => {}}>
      <MessageProperties message={message} controls={controls} />
    </Properties>
  );
}
