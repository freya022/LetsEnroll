export type Component = Row | Button | SelectMenu;

export type Row = {
  type: "row";
  components: Component[];
};

export const ButtonStyles = [
  "PRIMARY",
  "SECONDARY",
  "SUCCESS",
  "DANGER",
] as const;
export type ButtonStyle = (typeof ButtonStyles)[number];
export type Button = {
  type: "button";
  roleName: string;
  style: ButtonStyle;
  label: string | null;
  emoji: string | null;
};

export type SelectMenuChoice = {
  roleName: string;
  label: string;
  description: string | null;
  emoji: string | null;
};
export type SelectMenu = {
  type: "string_select_menu";
  placeholder: string | null;
  choices: SelectMenuChoice[];
};

export type RoleMessage = {
  content: string;
  components: Component[];
};

export type RolesConfig = {
  messages: RoleMessage[];
};
