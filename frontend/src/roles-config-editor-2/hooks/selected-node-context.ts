import { createContext, Dispatch, useContext } from "react";

export type SelectedNode = { id: number };

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
