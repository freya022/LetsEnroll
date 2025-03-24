import {
  Params as RouteParams,
  useLoaderData,
  useNavigation,
} from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormMessage } from "@/components/ui/form.tsx";
import { useLens } from "@hookform/lenses";
import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { MessageEditor } from "@/roles-config-editor/components/MessageEditor.tsx";

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
  const props = useLoaderData<Props>();
  const { state } = useNavigation();
  const [rolesConfig, setRolesConfig] = useState(props.rolesConfig);

  return (
    <div className="h-full w-full p-1">
      <div className="border-border h-full w-full rounded-lg border-2">
        <div
          className={`h-full w-full transition-opacity delay-100 duration-200 ease-in-out ${state === "loading" ? "opacity-25" : ""}`}
        >
          {rolesConfig ? (
            <RolesConfigEditor rolesConfig={rolesConfig} />
          ) : (
            <CreateConfigPrompt setRolesConfig={setRolesConfig} />
          )}
        </div>
      </div>
    </div>
  );
}

function RolesConfigEditor({ rolesConfig }: { rolesConfig: RolesConfig }) {
  const form = useForm<RolesConfig>({
    defaultValues: rolesConfig,
  });

  const lens = useLens({ control: form.control });

  const { fields: msgFields, append: appendMessage } = useFieldArray({
    control: form.control,
    name: "messages",
    rules: {
      required: true,
    },
  });

  function handleCreateMessage() {
    appendMessage({
      content: "",
      components: [],
    });
  }

  function onSubmit(values: RolesConfig) {
    console.log(values);
  }

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {msgFields.map((msg, msgIndex) => {
            return (
              <MessageEditor
                messageLens={lens.focus("messages").focus(`${msgIndex}`)}
                msgIndex={msgIndex}
                key={msg.id}
              />
            );
          })}
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateMessage}
            >
              Add message
            </Button>
          </div>
          {msgFields.length == 0 && (
            <FormMessage>You must create at least one message</FormMessage>
          )}
          <div>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function CreateConfigPrompt({
  setRolesConfig,
}: {
  setRolesConfig: Dispatch<SetStateAction<RolesConfig | undefined>>;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-semibold">No config exists for this guild</h1>
      <p className="text-lg">Would you like to create one?</p>
      <CreateConfigButton setRolesConfig={setRolesConfig} />
    </div>
  );
}

function CreateConfigButton({
  setRolesConfig,
}: {
  setRolesConfig: Dispatch<SetStateAction<RolesConfig | undefined>>;
}) {
  //TODO this should actually just change the state of the parent with an empty RolesConfig
  // as it should be pushed when explicitly saving
  // const mutation = useMutation({
  //   mutationFn: (newConfig: RolesConfig) => {
  //     return axios.post("/api/guilds/722891685755093072/roles", newConfig);
  //   },
  // });

  function handleButton() {
    setRolesConfig({
      messages: [
        {
          content: "a",
          components: [],
        },
      ],
    });

    // mutation.mutate({
    //   messages: [],
    // });
  }

  return (
    <>
      {/*{mutation.isPending && "Creating config..."}*/}

      {/*{mutation.isError && `Error: ${getErrorMessage(mutation.error)}`}*/}

      {/*{mutation.isSuccess && "Created successfully!"}*/}

      <Button onClick={handleButton}>Create config</Button>
    </>
  );
}
