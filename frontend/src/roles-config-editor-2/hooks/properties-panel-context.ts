import { createContext, RefObject, useContext } from "react";

export const PropertiesPanelRefContext = createContext<
  RefObject<HTMLDivElement | null>
>({
  current: null,
});

export function usePropertiesPanel() {
  const ref = useContext(PropertiesPanelRefContext);
  return ref.current;
}
