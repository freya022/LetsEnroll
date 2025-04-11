import { createContext, useContext } from "react";
import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { FieldErrors } from "react-hook-form";
import { ValidationError } from "@/roles-config-editor/types.ts";

// Callbacks to open back collapsible blocks on frontend validation errors
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

// Callbacks to open back collapsible blocks on backend validation errors
export type ValidationCollapsibleCallback = (errors: ValidationError[]) => void;
export type ValidationCollapsibleCallbacks = Map<
  string,
  ValidationCollapsibleCallback
>;

const validationCollapsibleCallbacksContext =
  createContext<ValidationCollapsibleCallbacks>(new Map());

export function useValidationCollapsibleCallbacks() {
  return useContext(validationCollapsibleCallbacksContext);
}
