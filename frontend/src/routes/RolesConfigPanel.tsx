import {
  Params as RouteParams,
  useLoaderData,
  useNavigation,
} from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button.tsx";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Form, FormMessage } from "@/components/ui/form.tsx";
import { useLens } from "@hookform/lenses";
import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { MessageEditor } from "@/roles-config-editor/components/MessageEditor.tsx";
import { formCollapsibleCallbacksContext } from "@/roles-config-editor/contexts.ts";

type Params = {
  guildId: string;
};

type Props = {
  guildId: string;
  rolesConfig?: RolesConfig;
};

async function loader({ params }: { params: RouteParams }): Promise<Props> {
  const { guildId } = params as Params;

  return {
    guildId,
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

  return (
    <div className="h-full">
      <div className="h-full rounded-lg">
        <div
          className={`h-full transition-opacity delay-100 duration-200 ease-in-out ${state === "loading" ? "opacity-25" : ""}`}
        >
          <RolesConfigForm key={props.guildId} />
        </div>
      </div>
    </div>
  );
}

// This needs to be in its own function so it can be keyed,
// so the form resets when switching guilds
// https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key
function RolesConfigForm() {
  const props = useLoaderData<Props>();
  const [rolesConfig, setRolesConfig] = useState(props.rolesConfig);
  return rolesConfig ? (
    <RolesConfigEditor rolesConfig={rolesConfig} />
  ) : (
    <CreateConfigPrompt setRolesConfig={setRolesConfig} />
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

  const formCollapsibleCallbacks = useContext(formCollapsibleCallbacksContext);

  const onSubmit: SubmitHandler<RolesConfig> = (values: RolesConfig) => {
    console.log(values);
  };

  const onInvalid: SubmitErrorHandler<RolesConfig> = (errors) => {
    formCollapsibleCallbacks.forEach((value) => value(errors));
  };

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="flex flex-col gap-y-4"
        >
          {msgFields.map((msg, msgIndex) => {
            return (
              <MessageEditor
                messageLens={lens.focus("messages").focus(`${msgIndex}`)}
                msgIndex={msgIndex}
                key={msg.id}
              />
            );
          })}
          <Button
            type="button"
            variant="secondary"
            onClick={handleCreateMessage}
          >
            Add message
          </Button>
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
