import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

// TODO shouldn't this be a reducer?
export interface Controls<T extends Identifiable<unknown>> {
  update(value: T): void;
  // delete(): void;
  // TODO move previous/next
}
