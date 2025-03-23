export type UnicodeEmoji = {
  unicode: string;
};
export type CustomEmoji = {
  name: string;
  discordId: string;
  animated: boolean;
};
export type Emoji = UnicodeEmoji | CustomEmoji;

export type Component = Row | Button | SelectMenu;

export type Row = {
  type: "row";
  components: Component[];
};

export type ButtonStyle = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
export type Button = {
  type: "button";
  roleName: string;
  style: ButtonStyle;
  label: string | null;
  emoji: Emoji | null;
};

export type SelectMenuChoice = {
  roleName: string;
  name: string;
  description: string | null;
  emoji: Emoji | null;
};
export type SelectMenu = {
  type: "string_select_menu";
  choices: SelectMenuChoice[];
};

export type RoleMessage = {
  content: string;
  components: Component[];
};

export type RolesConfig = {
  messages: RoleMessage[];
};
