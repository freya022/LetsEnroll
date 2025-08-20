import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import { MessageData } from "@/roles-config-editor-2/types/message-data.ts";
import {
  ComponentData,
  SelectMenuChoiceData,
} from "@/roles-config-editor-2/types/components.ts";

// TODO move "type" to Identifiable
type TypedIdentifiable = MessageData | ComponentData | SelectMenuChoiceData;

type TypedIdentifiableWithParent<
  T extends TypedIdentifiable = TypedIdentifiable,
> = {
  element: T;
  parent: TypedIdentifiable[];
};

export function findNextId(config: RolesConfigData) {
  return Math.max(...getAllIdentifiables(config).map((t) => t.element.id));
}

export function findDraftObj<T extends TypedIdentifiable>(
  draft: RolesConfigData,
  target: T,
): TypedIdentifiableWithParent<T> | undefined {
  for (const { element, parent } of getAllIdentifiables(draft)) {
    if (element.type === target.type && element.id === target.id) {
      return { element: element as T, parent };
    }
  }
}

function getAllIdentifiables(
  config: RolesConfigData,
): TypedIdentifiableWithParent[] {
  const stack: TypedIdentifiableWithParent[] = associateArrayChildren(
    config,
    (c) => c.messages,
  );
  const identifiables: TypedIdentifiableWithParent[] = [];

  let i = 0;
  while (stack.length > i) {
    // Do not use unshift() as this will delete elements from RolesConfigData
    // and also do not make copies as to preserve Immer's proxies
    const { element, parent } = stack[i++]!;
    switch (element.type) {
      case "message": {
        identifiables.push({ element, parent });
        stack.push(...associateArrayChildren(element, (e) => e.components));
        break;
      }
      case "row": {
        identifiables.push({ element, parent });
        stack.push(...associateArrayChildren(element, (e) => e.components));
        break;
      }
      case "button": {
        identifiables.push({ element, parent });
        break;
      }
      case "string_select_menu": {
        identifiables.push({ element, parent });
        stack.push(...associateArrayChildren(element, (e) => e.choices));
        break;
      }
      case "select_menu_choice": {
        identifiables.push({ element, parent });
        break;
      }
      default:
        throw new Error(`Unknown element: ${JSON.stringify(element)}`);
    }
  }

  return identifiables;
}

function associateArrayChildren<T, R extends TypedIdentifiable>(
  container: T,
  valuesFn: (t: T) => R[],
): TypedIdentifiableWithParent<R>[] {
  const values = valuesFn(container);
  return values.map((t) => ({
    element: t,
    parent: values,
  }));
}
