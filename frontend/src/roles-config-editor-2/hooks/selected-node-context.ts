import { createContext, Dispatch, useContext } from "react";
import { Identifiable } from "@/roles-config-editor-2/types/identifiable.ts";

export type SelectedNode = Identifiable<object>;

type MutableSelectedNode = {
  selectedNode: SelectedNode | null;
  setSelectedNode: Dispatch<SelectedNode | null>;
};

export const MutableSelectedNodeContext = createContext<MutableSelectedNode>({
  selectedNode: null,
  setSelectedNode: () => {
    throw Error("Cannot mutate default context");
  },
});

export function useMutableSelectedNode() {
  return useContext(MutableSelectedNodeContext);
}
