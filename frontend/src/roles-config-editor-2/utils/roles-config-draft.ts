import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import {
  findDraftObj,
  getAllIdentifiables,
} from "@/roles-config-editor-2/utils/identifiable.ts";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

export class RolesConfigDraft {
  private maxId: number;

  constructor(readonly draft: RolesConfigData) {
    this.draft = draft;
    this.maxId = this.findMaxId() ?? -1;
  }

  private findMaxId(): number | undefined {
    let maxIdentifiable: number | undefined;

    for (const { element: identifiable } of getAllIdentifiables(this.draft)) {
      if (!maxIdentifiable || maxIdentifiable < identifiable.id) {
        maxIdentifiable = identifiable.id;
      }
    }

    return maxIdentifiable;
  }

  find<T extends Identifiable>(identifiable: T): T | undefined {
    return findDraftObj(this.draft, identifiable)?.element;
  }

  newMessage(): MessageData {
    return {
      type: "message",
      id: ++this.maxId,
      content: "",
      components: [],
    };
  }
}
