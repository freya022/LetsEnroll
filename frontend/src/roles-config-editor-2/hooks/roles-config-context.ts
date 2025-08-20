import { createContext, Dispatch, useContext } from "react";
import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import { RolesConfigReducerAction } from "@/roles-config-editor-2/utils/roles-config-reducer.ts";

export const RolesConfigContext = createContext<RolesConfigData | null>(null);
export const RolesConfigDispatchContext =
  createContext<Dispatch<RolesConfigReducerAction> | null>(null);

export function useRolesConfig() {
  return useContext(RolesConfigContext);
}

export function useRolesConfigDispatch() {
  return useContext(RolesConfigDispatchContext);
}
