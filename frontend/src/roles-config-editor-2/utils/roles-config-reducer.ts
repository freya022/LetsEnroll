import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import { findDraftObj } from "@/roles-config-editor-2/utils/identifiable.ts";
import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";
import { RolesConfigDraft } from "@/roles-config-editor-2/utils/roles-config-draft.ts";

type RolesConfigReducerAddMessageAction = {
  type: "add_message";
};

type RolesConfigReducerEditAction = {
  type: "edit";
  fn: (draft: RolesConfigDraft) => void;
};

type RolesConfigReducerDeleteAction = {
  type: "delete";
  obj: Identifiable;
};

export type RolesConfigReducerAction =
  | RolesConfigReducerAddMessageAction
  | RolesConfigReducerEditAction
  | RolesConfigReducerDeleteAction;

export function rolesConfigReducer(
  draft: RolesConfigData,
  action: RolesConfigReducerAction,
): void {
  switch (action.type) {
    case "add_message": {
      return void draft.messages.push(new RolesConfigDraft(draft).newMessage());
    }
    case "edit": {
      return void action.fn(new RolesConfigDraft(draft));
    }
    case "delete": {
      const draftObj = findDraftObj(draft, action.obj);
      if (!draftObj) return;

      const index = draftObj.parent.findIndex((t) => t.id === action.obj.id);
      if (index == -1) return;

      return void draftObj.parent.splice(index, 1);
    }
    default:
      throw new Error("Unknown action type");
  }
}
