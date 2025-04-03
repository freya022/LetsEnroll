import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import {
  NavLink,
  Params as RouteParams,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteLoaderData,
} from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import { getRoleCount } from "@/roles-config-editor/utils.ts";
import { GuildDTO } from "@/dto/GuildDTO.ts";

type Params = {
  guildId: string;
};

type Props = {
  rolesConfig?: RolesConfig;
};

async function loader({ params }: { params: RouteParams }): Promise<Props> {
  const { guildId } = params as Params;

  return {
    rolesConfig: await axios
      .get(`/api/guilds/${guildId}/roles`)
      .catch((error) => {
        if (error.status === 404) return null;
        throw error;
      })
      .then((res) => res?.data as RolesConfig),
  };
}

RolesConfigPanel.loader = loader;

export default function RolesConfigPanel() {
  const { rolesConfig } = useLoaderData<Props>();
  const { state } = useNavigation();

  return (
    <div className="h-full">
      <div className="h-full rounded-lg">
        <div
          className={`h-full transition-opacity delay-100 duration-200 ease-in-out ${state === "loading" ? "opacity-25" : ""}`}
        >
          {rolesConfig ? (
            <EditOrPublishPanel rolesConfig={rolesConfig} />
          ) : (
            <CreateConfigPanel />
          )}
        </div>
      </div>
    </div>
  );
}

function EditOrPublishPanel({ rolesConfig }: { rolesConfig: RolesConfig }) {
  const { guildId } = useParams<Params>();
  const { managedGuilds } = useRouteLoaderData<{ managedGuilds: GuildDTO[] }>(
    "dashboard",
  )!;
  const guild = managedGuilds.find((g) => g.id === guildId)!;

  const messageCount = rolesConfig.messages.length;
  const roleCount = rolesConfig.messages.reduce(
    (previousValue, currentValue) =>
      previousValue + getRoleCount(currentValue.components),
    0,
  );

  return (
    <div className="flex h-full flex-col items-center">
      <h3 className="text-xl font-semibold">
        Roles configuration for '{guild.name}'
      </h3>
      <div className="flex grow flex-col items-center justify-center gap-y-4">
        <p className="text-lg font-semibold text-gray-400">
          {messageCount} messages, {roleCount} roles
        </p>
        <div className="grid w-xs grid-cols-2 justify-stretch gap-x-6">
          <Button asChild>
            <NavLink to="./edit">Edit...</NavLink>
          </Button>
          <Button variant="secondary" asChild>
            <NavLink to="./publish">Publish...</NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}

function CreateConfigPanel() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-semibold">No config exists for this guild</h1>
      <p className="text-lg">Would you like to create one?</p>
      <Button asChild>
        <NavLink to="./edit">Create config</NavLink>
      </Button>
    </div>
  );
}
