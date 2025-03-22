import {
  Params as RouteParams,
  useLoaderData,
  useNavigation,
} from "react-router";
import axios from "axios";
import { Button as ButtonComponent } from "@/components/ui/button.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

function nextUUID() {
  return crypto.randomUUID().toString();
}

type Params = {
  guildId: string;
};

type UnicodeEmoji = {
  unicode: string;
};
type CustomEmoji = {
  name: string;
  discordId: string;
  animated: boolean;
};
type Emoji = UnicodeEmoji | CustomEmoji;

type Component = Row | Button | SelectMenu;

type Row = {
  type: "row";
  uuid: string;
  components: Component[];
};

type ButtonStyle = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
type Button = {
  type: "button";
  uuid: string;
  roleName: string;
  style: ButtonStyle;
  label?: string;
  emoji?: Emoji;
};

type SelectMenuChoice = {
  roleName: string;
  name: string;
  description?: string;
  emoji?: Emoji;
};
type SelectMenu = {
  type: "string_select_menu";
  uuid: string;
  choices: SelectMenuChoice[];
};

type RoleMessage = {
  uuid: string;
  content: string;
  components: Component[];
};

type RolesConfig = {
  messages: RoleMessage[];
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
    <div
      className={`h-full w-full transition-opacity delay-100 duration-200 ease-in-out ${state === "loading" ? "opacity-25" : ""}`}
    >
      {rolesConfig ? (
        <RolesConfigEditor
          rolesConfig={rolesConfig}
          setRolesConfig={setRolesConfig}
        />
      ) : (
        <CreateConfigPrompt setRolesConfig={setRolesConfig} />
      )}
    </div>
  );
}

const roleMessage = z.object({
  content: z.string(),
});
const rolesConfigSchema = z.object({
  messages: z.array(roleMessage),
  // .nonempty("You must create at least one message"),
});

function RolesConfigEditor({
  rolesConfig,
  setRolesConfig,
}: {
  rolesConfig: RolesConfig;
  setRolesConfig: Dispatch<SetStateAction<RolesConfig | undefined>>;
}) {
  console.log("default values", rolesConfig);
  const form = useForm<z.infer<typeof rolesConfigSchema>>({
    resolver: zodResolver(rolesConfigSchema),
    values: rolesConfig,
    resetOptions: {
      keepDirtyValues: true,
      keepDefaultValues: true,
      keepValues: false,
    },
  });

  function handleCreateMessage() {
    setRolesConfig((current) => ({
      ...current,
      messages: [
        ...current!.messages,
        {
          uuid: nextUUID(),
          content: "Sample text",
          components: [],
        },
      ],
    }));
  }

  function onSubmit(values: z.infer<typeof rolesConfigSchema>) {
    console.log(values);
  }

  return (
    <div className="h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name={`messages`}
            render={() => (
              <FormItem>
                <FormLabel>Messages</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          {rolesConfig.messages.map((msg, msgIndex) => {
            function handleAddRow() {
              const newRow: Row = {
                type: "row",
                uuid: nextUUID(),
                components: [],
              };

              msg.components = [...msg.components, newRow];

              setRolesConfig({ ...rolesConfig });
            }

            return (
              <div key={msg.uuid}>
                <FormLabel>Message #{msgIndex}</FormLabel>
                <FormField
                  control={form.control}
                  name={`messages.${msgIndex}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The main content of the message.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {msg.components.map((component) => (
                  <FormComponent
                    setRolesConfig={setRolesConfig}
                    rolesConfig={rolesConfig}
                    component={component}
                    key={component.uuid}
                  />
                ))}
                <ButtonComponent
                  variant="secondary"
                  type="button"
                  onClick={handleAddRow}
                >
                  Add row
                </ButtonComponent>
              </div>
            );
          })}
          <div>
            <ButtonComponent
              type="button"
              variant="secondary"
              onClick={handleCreateMessage}
            >
              Add message
            </ButtonComponent>
          </div>
          <div>
            <ButtonComponent type="submit">Save</ButtonComponent>
          </div>
        </form>
      </Form>
    </div>
  );
}

function FormComponent({
  rolesConfig,
  setRolesConfig,
  component,
}: {
  rolesConfig: RolesConfig;
  setRolesConfig: Dispatch<SetStateAction<RolesConfig | undefined>>;
  component: Component;
}) {
  if (component.type === "button") {
    return <div>button</div>;
  } else if (component.type === "string_select_menu") {
    return <div>select menu</div>;
  } else if (component.type === "row") {
    return (
      <FormRow
        row={component}
        rolesConfig={rolesConfig}
        setRolesConfig={setRolesConfig}
      />
    );
  }
}

function FormRow({
  row,
  rolesConfig,
  setRolesConfig,
}: {
  row: Row;
  setRolesConfig: Dispatch<SetStateAction<RolesConfig | undefined>>;
  rolesConfig: RolesConfig;
}) {
  function handleCreateButton() {
    const newButton: Button = {
      type: "button",
      uuid: nextUUID(),
      roleName: "",
      style: "PRIMARY",
    };

    row.components = [...row.components, newButton];

    setRolesConfig({ ...rolesConfig });
  }

  function handleCreateSelectMenu() {}

  return (
    <div>
      <div>Row</div>
      {row.components.map((component) => {
        return (
          <FormComponent
            rolesConfig={rolesConfig}
            setRolesConfig={setRolesConfig}
            component={component}
            key={component.uuid}
          />
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonComponent type="button" variant="secondary">
            New component...
          </ButtonComponent>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleCreateButton}>
            Button
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCreateSelectMenu}>
            Select menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
          uuid: nextUUID(),
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

      <ButtonComponent onClick={handleButton}>Create config</ButtonComponent>
    </>
  );
}
