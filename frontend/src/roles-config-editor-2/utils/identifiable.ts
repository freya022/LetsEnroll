import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

export function replaceIdentifiable<T extends Identifiable<unknown>>(
  iter: Array<T>,
  item: T,
) {
  return iter.map((old) => {
    if (old.id == item.id) {
      return item; // update
    } else {
      return old;
    }
  });
}
