import { createContext, useContext } from "react";
import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { FieldErrors } from "react-hook-form";

export type FormCollapsibleCallback = (
  errors: FieldErrors<RolesConfig>,
) => void;
export type FormCollapsibleCallbacks = Map<string, FormCollapsibleCallback>;

const formCollapsibleCallbacksContext = createContext<FormCollapsibleCallbacks>(
  new Map(),
);

export function useFormCollapsibleCallbacks() {
  return useContext(formCollapsibleCallbacksContext);
}