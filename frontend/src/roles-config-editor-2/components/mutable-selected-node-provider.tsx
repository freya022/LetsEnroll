import { ReactNode, useState } from "react";
import {
  MutableSelectedNodeContext,
  SelectedNode,
} from "@/roles-config-editor-2/hooks/selected-node-context.ts";

export default function MutableSelectedNodeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  return (
    <MutableSelectedNodeContext value={{ selectedNode, setSelectedNode }}>
      {children}
    </MutableSelectedNodeContext>
  );
}
