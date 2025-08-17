import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

export type ComponentData = RowData | ButtonData | SelectMenuData;

export type RowData = Identifiable<{
  type: "row";
  components: ComponentData[];
}>;

export const ButtonStyles = [
  "PRIMARY",
  "SECONDARY",
  "SUCCESS",
  "DANGER",
] as const;
export type ButtonStyle = (typeof ButtonStyles)[number];
export type ButtonData = Identifiable<{
  type: "button";
  roleName: string;
  style: ButtonStyle;
  label: string | null;
  emoji: string | null;
}>;

export type SelectMenuChoiceData = Identifiable<{
  roleName: string;
  label: string;
  description: string | null;
  emoji: string | null;
}>;
export type SelectMenuData = Identifiable<{
  type: "string_select_menu";
  placeholder: string | null;
  choices: SelectMenuChoiceData[];
}>;
