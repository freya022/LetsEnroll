import { ComponentData } from "@/roles-config-editor-2/types/component-data.ts";

export type MessageData = {
  type: "message";
  id: number;
  content: string;
  components: ComponentData[];
};
