import { ComponentData } from "@/roles-config-editor-2/types/components.ts";

export type MessageData = {
  type: "message";
  id: number;
  content: string;
  components: ComponentData[];
};
