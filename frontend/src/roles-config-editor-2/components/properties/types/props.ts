import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import {
  ButtonData,
  SelectMenuData,
} from "@/roles-config-editor-2/types/components.ts";

export type PropertiesRendererProps =
  | MessagePropertiesRendererProps
  | ButtonPropertiesRendererProps
  | SelectMenuPropertiesRendererProps;

export type MessagePropertiesRendererProps = {
  id: "message";
  message: MessageData;
};

export type ButtonPropertiesRendererProps = {
  id: "button";
  button: ButtonData;
};

export type SelectMenuPropertiesRendererProps = {
  id: "selectMenu";
  selectMenu: SelectMenuData;
};
