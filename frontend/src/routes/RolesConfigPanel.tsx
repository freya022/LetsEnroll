import {
  ActionFunctionArgs,
  Params as RouteParams,
  useBlocker,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button.tsx";
import { useContext, useEffect, useState } from "react";
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
import { getErrorMessage } from "@/utils.ts";

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
  const { rolesConfig } = useLoaderData<Props>();
  const [create, setCreate] = useState(false);
  return rolesConfig ? (
    <RolesConfigEditor rolesConfig={rolesConfig} />
  ) : create ? (
    <RolesConfigEditor rolesConfig={{ messages: [] }} />
  ) : (
    <CreateConfigPrompt setCreate={setCreate} />
  );
}

type ActionReturnArgs = {
  error?: AxiosError;
};

async function action({
  request,
  params: { guildId },
}: ActionFunctionArgs): Promise<ActionReturnArgs> {
  const data = await request.json();

  try {
    await axios.put(`/api/guilds/${guildId}/roles`, data);
  } catch (e) {
    return { error: e as AxiosError };
  }

  return {};
}

RolesConfigPanel.action = action;

function RolesConfigEditor({ rolesConfig }: { rolesConfig: RolesConfig }) {
  const fetcher = useFetcher<ActionReturnArgs>();
  const form = useForm<RolesConfig>({
    defaultValues: rolesConfig,
    // Would disable the form inputs when submitting but this causes an infinite loop :)
  });

  // Reset the form if the rolesConfig changes,
  // this happens when the page is reloaded after submission
  useEffect(() => {
    form.reset(rolesConfig);
  }, [form, rolesConfig]);

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

  // Don't ask me why this needs to be computed outside the callback for it to ever be updated.
  // useCallback with a dependency on "form" does not help either.
  const { isDirty } = form.formState;
  useBlocker(() => {
    if (!isDirty) return false;

    // TODO in-app alert dialog https://ui.shadcn.com/docs/components/alert-dialog
    return !confirm("Do you want to discard your changes?");
  });

  const formCollapsibleCallbacks = useContext(formCollapsibleCallbacksContext);

  const onSubmit: SubmitHandler<RolesConfig> = async (values: RolesConfig) => {
    await fetcher.submit(values, {
      method: "post",
      encType: "application/json",
    });
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
            {fetcher.state !== "idle" ? (
              <Button disabled>Saving...</Button>
            ) : (
              <>
                <Button type="submit">Save</Button>

                {fetcher.data?.error && (
                  <p className="text-destructive">
                    An error occurred: {getErrorMessage(fetcher.data.error)}
                  </p>
                )}

                {fetcher.data && fetcher.data.error === undefined && (
                  <p className="text-green-500">Saved!</p>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function CreateConfigPrompt({
  setCreate,
}: {
  setCreate: (create: boolean) => void;
}) {
  function handleCreateConfig() {
    setCreate(true);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-semibold">No config exists for this guild</h1>
      <p className="text-lg">Would you like to create one?</p>
      <Button onClick={handleCreateConfig}>Create config</Button>
    </div>
  );
}
