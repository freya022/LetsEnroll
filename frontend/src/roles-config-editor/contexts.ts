import { createContext } from "react";
import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { FieldErrors } from "react-hook-form";

export type FormCollapsibleCallback = (
  errors: FieldErrors<RolesConfig>,
) => void;
export type FormCollapsibleCallbacks = Map<string, FormCollapsibleCallback>;

export const formCollapsibleCallbacksContext =
  createContext<FormCollapsibleCallbacks>(new Map());
