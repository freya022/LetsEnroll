import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import {
  ComponentData,
  SelectMenuChoiceData,
} from "@/roles-config-editor-2/types/components.ts";

export type Identifiable = MessageData | ComponentData | SelectMenuChoiceData;
