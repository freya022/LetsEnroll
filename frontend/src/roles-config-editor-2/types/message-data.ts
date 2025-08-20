import { ComponentData } from "@/roles-config-editor-2/types/components.ts";
import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

export type MessageData = Identifiable<{
  type: "message";
  content: string;
  components: ComponentData[];
}>;
