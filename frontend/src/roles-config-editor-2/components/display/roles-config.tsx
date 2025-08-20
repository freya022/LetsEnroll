import { useRolesConfig } from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import Message from "@/roles-config-editor-2/components/display/message.tsx";

export function RolesConfig() {
  const rolesConfig = useRolesConfig()!;

  return (
    <div className="pt-4 pr-2 pb-2 pl-4">
      {rolesConfig.messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
}
