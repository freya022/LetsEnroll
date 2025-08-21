import { RolesConfigData } from "@/roles-config-editor-2/types/roles-config-data.ts";
import { ReactNode } from "react";
import { useImmerReducer } from "use-immer";
import {
  RolesConfigContext,
  RolesConfigDispatchContext,
} from "@/roles-config-editor-2/hooks/roles-config-context.ts";
import { rolesConfigReducer } from "@/roles-config-editor-2/utils/roles-config-reducer.ts";

export function RolesConfigProvider({
  data,
  children,
}: {
  data: RolesConfigData;
  children: ReactNode;
}) {
  const [config, dispatch] = useImmerReducer(rolesConfigReducer, data);

  return (
    <RolesConfigContext value={config}>
      <RolesConfigDispatchContext value={dispatch}>
        {children}
      </RolesConfigDispatchContext>
    </RolesConfigContext>
  );
}
