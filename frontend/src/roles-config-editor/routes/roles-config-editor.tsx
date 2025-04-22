import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import {
  ActionFunctionArgs,
  FetcherWithComponents,
  Params as RouteParams,
  useBlocker,
  useFetcher,
  useLoaderData,
} from "react-router";
import {
  FieldValues,
  FormState,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useEffect } from "react";
import { useLens } from "@hookform/lenses";
import {
  useFormCollapsibleCallbacks,
  useValidationCollapsibleCallbacks,
} from "@/roles-config-editor/contexts.ts";
import { Form, FormMessage } from "@/components/ui/form.tsx";
import { MessageEditor } from "@/roles-config-editor/components/message-editor.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getErrorMessage } from "@/utils.ts";
import axios, { AxiosError } from "axios";
import { useSelectedGuild } from "@/roles-config-editor/utils.ts";
import { useMutation } from "@tanstack/react-query";
import { ValidationError } from "@/roles-config-editor/types.ts";

type Params = {
  guildId: string;
};

type Props = {
  rolesConfig: RolesConfig;
};

async function loader({ params }: { params: RouteParams }): Promise<Props> {
  const { guildId } = params as Params;

  const existingRolesConfig = await axios
    .get(`/api/guilds/${guildId}/roles`)
    .catch((error) => {
      if (error.status === 404) return null;
      throw error;
    })
    .then((res) => res?.data as RolesConfig);

  return {
    rolesConfig: existingRolesConfig ?? { messages: [] },
  };
}

RolesConfigEditor.loader = loader;

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

RolesConfigEditor.action = action;

export default function RolesConfigEditor() {
  const { rolesConfig } = useLoaderData<Props>();

  // Form
  const form = useForm<RolesConfig>({
    defaultValues: rolesConfig,
    // Would disable the form inputs when submitting but this causes an infinite loop :)
  });

  // Reset the form if the rolesConfig changes,
  // this happens when the page is reloaded after submission
  useEffect(() => {
    form.reset(rolesConfig, {
      keepDirty: false,
      keepDirtyValues: false,
    });
  }, [form, rolesConfig]);

  const lens = useLens({ control: form.control });

  const {
    fields: msgFields,
    append: appendMessage,
    remove: removeMessage,
  } = useFieldArray({
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

  // Block navigating away from dirty form
  useUnsavedEditBlocker(form.formState);

  // Handlers
  const fetcher = useFetcher<ActionReturnArgs>();
  const { validationMutation, onSubmit } = useSubmitHandler(form, fetcher);
  const onInvalid = useInvalidHandler();

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
                onMessageDelete={() => removeMessage(msgIndex)}
              />
            );
          })}
          <Button
            type="button"
            variant="secondary"
            onClick={handleCreateMessage}
            disabled={msgFields.length >= 10}
          >
            Add message
          </Button>
          {msgFields.length == 0 && (
            <FormMessage>You must create at least one message</FormMessage>
          )}
          <div>
            {validationMutation.isPending ? (
              <Button className="w-24" disabled>
                Validating...
              </Button>
            ) : fetcher.state !== "idle" ? (
              <Button className="w-24" disabled>
                Saving...
              </Button>
            ) : (
              <>
                <Button className="w-24" type="submit">
                  Save
                </Button>

                {fetcher.data?.error && (
                  <p className="text-destructive">
                    An error occurred: {getErrorMessage(fetcher.data.error)}
                  </p>
                )}

                {fetcher.data && fetcher.data.error === undefined && (
                  <p className="text-green-700 dark:text-green-500">Saved!</p>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function useUnsavedEditBlocker<T extends FieldValues>({
  isDirty,
}: FormState<T>) {
  useBlocker(() => {
    if (!isDirty) return false;

    // TODO in-app alert dialog https://ui.shadcn.com/docs/components/alert-dialog
    return !confirm("Do you want to discard your changes?");
  });

  // Closing/reloading tab
  // Not using useBeforeUnload because: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes
  useEffect(() => {
    if (!isDirty) return;

    const listener = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [isDirty]);
}

function useSubmitHandler(
  form: UseFormReturn<RolesConfig>,
  fetcher: FetcherWithComponents<ActionReturnArgs>,
) {
  const guild = useSelectedGuild();
  const validationMutation = useMutation({
    mutationFn: async (newConfig: RolesConfig) => {
      const response = await axios.post(
        `/api/guilds/${guild.id}/roles/check`,
        newConfig,
      );
      return response.data as ValidationError[];
    },
  });

  const validationCollapsibleCallbacks = useValidationCollapsibleCallbacks();
  const onSubmit: SubmitHandler<RolesConfig> = async (values: RolesConfig) => {
    const errors = await validationMutation.mutateAsync(values);
    if (errors.length > 0) {
      for (const error of errors) {
        // @ts-expect-error The path string is correct
        form.setError(error.path, { type: "server", message: error.message });
      }
      validationCollapsibleCallbacks.forEach((value) => value(errors));
      return;
    }

    await fetcher.submit(values, {
      method: "post",
      encType: "application/json",
    });
  };

  return { validationMutation, onSubmit };
}

function useInvalidHandler() {
  const formCollapsibleCallbacks = useFormCollapsibleCallbacks();
  const onInvalid: SubmitErrorHandler<RolesConfig> = (errors) => {
    formCollapsibleCallbacks.forEach((value) => value(errors));
  };

  return onInvalid;
}
