import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { Params as RouteParams, useLoaderData } from "react-router";
import axios from "axios";

type Params = {
  guildId: string;
};

type Props = {
  rolesConfig: RolesConfig;
};

async function loader({ params }: { params: RouteParams }): Promise<Props> {
  const { guildId } = params as Params;

  return {
    rolesConfig: await axios
      .get(`/api/guilds/${guildId}/roles`)
      .then((res) => res.data as RolesConfig),
  };
}

RolesConfigPublisher.loader = loader;

export default function RolesConfigPublisher() {
  const { rolesConfig } = useLoaderData<Props>();

  return <>Publisher</>;
}
