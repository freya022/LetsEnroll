import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import { findNextId } from "@/roles-config-editor-2/utils/identifiable.ts";

type RolesConfigReducerAddMessageAction = {
  type: "add_message";
};

type RolesConfigReducerEditAction = {
  type: "edit";
  fn: (draft: RolesConfigData) => void;
};

export type RolesConfigReducerAction =
  | RolesConfigReducerAddMessageAction
  | RolesConfigReducerEditAction;

export function rolesConfigReducer(
  draft: RolesConfigData,
  action: RolesConfigReducerAction,
): void {
  switch (action.type) {
    case "add_message": {
      return void draft.messages.push({
        type: "message",
        id: findNextId(draft),
        content: "",
        components: [],
      });
    }
    case "edit": {
      return void action.fn(draft);
    }
    default:
      throw new Error("Unknown action type");
  }
}
