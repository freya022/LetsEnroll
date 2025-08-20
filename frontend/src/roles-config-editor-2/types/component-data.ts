export type ComponentData = RowData | ButtonData | SelectMenuData;

export type RowData = {
  type: "row";
  id: number;
  components: ComponentData[];
};

export const ButtonStyles = [
  "PRIMARY",
  "SECONDARY",
  "SUCCESS",
  "DANGER",
] as const;
export type ButtonStyle = (typeof ButtonStyles)[number];
export type ButtonData = {
  type: "button";
  id: number;
  roleName: string;
  style: ButtonStyle;
  label: string | null;
  emoji: string | null;
};

export type SelectMenuChoiceData = {
  type: "select_menu_choice";
  id: number;
  roleName: string;
  label: string;
  description: string | null;
  emoji: string | null;
};
export type SelectMenuData = {
  id: number;
  type: "string_select_menu";
  placeholder: string | null;
  choices: SelectMenuChoiceData[];
};
