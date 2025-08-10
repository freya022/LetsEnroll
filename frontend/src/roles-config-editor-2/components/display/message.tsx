import { useRouteLoaderData } from "react-router";
import { UserDTO } from "@/dto/UserDTO.ts";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import { getAvatarUrl } from "@/utils/user.ts";
import Components from "@/roles-config-editor-2/components/display/components.tsx";
import ActionRow from "@/roles-config-editor-2/components/display/action-row.tsx";
import Button from "@/roles-config-editor-2/components/display/button.tsx";
import AddRowComponentDropdown from "@/roles-config-editor-2/components/display/add-row-component-dropdown.tsx";
import SelectMenu from "@/roles-config-editor-2/components/display/select-menu.tsx";
import AddTopLevelComponentDropdown from "@/roles-config-editor-2/components/display/add-top-level-component-dropdown.tsx";
import AddMessage from "@/roles-config-editor-2/components/display/add-message.tsx";

export default function Message() {
  const { user } = useRouteLoaderData<{ user: UserDTO }>("root")!;

  return (
    <div className="flex gap-4">
      <Avatar className="mt-0.5">
        <AvatarImage
          src={getAvatarUrl(user)}
          alt={`Avatar of ${user.effectiveName}`}
        />
      </Avatar>
      <div>
        <div>
          <span>{user.effectiveName}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          <span>Message content</span>
          <Components>
            <ActionRow>
              <Button hasError={true} />
              <Button hasError={false} />
              <Button hasError={false} />
              <AddRowComponentDropdown />
            </ActionRow>
            <ActionRow>
              <SelectMenu />
            </ActionRow>
            <AddTopLevelComponentDropdown />
          </Components>
        </div>
        <div className="mt-1">
          <AddMessage />
        </div>
      </div>
    </div>
  );
}
