import {
  Params as RouteParams,
  useLoaderData,
  useNavigation,
} from "react-router";
import axios from "axios";
import { Button as ButtonComponent } from "@/components/ui/button.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
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
import { Lens, useLens } from "@hookform/lenses";
import {
  Button,
  ButtonStyles,
  Component,
  CustomEmoji,
  Emoji,
  RoleMessage,
  RolesConfig,
  Row,
  UnicodeEmoji,
} from "@/dto/RolesConfigDTO.ts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { capitalize } from "@/utils.ts";
import { Switch } from "@/components/ui/switch.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

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

  const watchMessages = form.watch("messages");

  function handleCreateMessage() {
    appendMessage({
      content: "Sample text",
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
          {watchMessages.length == 0 && (
            <FormMessage>You must create at least one message</FormMessage>
          )}
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

function MessageEditor({
  messageLens,
  msgIndex,
}: {
  messageLens: Lens<RoleMessage>;
  msgIndex: number;
}) {
  const componentsLens = messageLens.focus("components");

  const { fields: componentFields, append: appendComponent } = useFieldArray({
    ...componentsLens.interop(),
    rules: {
      required: true,
    },
  });

  const components = useWatch({
    name: componentsLens.interop().name,
    control: componentsLens.interop().control,
  });

  function handleAddRow() {
    appendComponent({
      type: "row",
      components: [],
    });
  }

  return (
    <div>
      <FormLabel>Message #{msgIndex}</FormLabel>
      <FormField
        {...messageLens.focus("content").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>The main content of the message.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {componentFields.map((component, componentIndex) => (
        <ComponentEditor
          componentLens={componentsLens.focus(`${componentIndex}`)}
          component={component}
          key={component.id}
        />
      ))}
      {components.length == 0 && (
        <FormMessage>A message must have at least one component</FormMessage>
      )}
      <ButtonComponent variant="secondary" type="button" onClick={handleAddRow}>
        Add row
      </ButtonComponent>
    </div>
  );
}

function ComponentEditor({
  componentLens,
  component,
}: {
  componentLens: Lens<Component>;
  component: Component;
}) {
  if (component.type === "button") {
    return <ButtonEditor buttonLens={componentLens as Lens<Button>} />;
  } else if (component.type === "string_select_menu") {
    return <div>select menu</div>;
  } else if (component.type === "row") {
    return <RowEditor rowLens={componentLens as Lens<Row>} />;
  }
}

function RowEditor({ rowLens }: { rowLens: Lens<Row> }) {
  const componentsLens = rowLens.focus("components");

  const { fields: componentFields, append: appendComponent } = useFieldArray({
    ...componentsLens.interop(),
    rules: {
      required: true,
    },
  });

  const components = useWatch({
    name: componentsLens.interop().name,
    control: componentsLens.interop().control,
  });

  function handleCreateButton() {
    appendComponent({
      type: "button",
      roleName: "",
      style: "PRIMARY",
      label: null,
      emoji: null,
    });
  }

  function handleCreateSelectMenu() {}

  return (
    <div>
      <div>Row</div>
      {components.length == 0 && (
        <FormMessage>A row must have at least one component</FormMessage>
      )}
      {componentFields.map((component, componentIndex) => {
        return (
          <ComponentEditor
            componentLens={componentsLens.focus(`${componentIndex}`)}
            component={component}
            key={component.id}
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

function ButtonEditor({ buttonLens }: { buttonLens: Lens<Button> }) {
  const form = useFormContext<RolesConfig>();

  return (
    <div>
      <FormField
        {...buttonLens.focus("style").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Style</FormLabel>
            <FormControl>
              <ToggleGroup
                variant="outline"
                {...field}
                type="single"
                onValueChange={(value) => {
                  // @ts-expect-error u dum
                  form.setValue(field.name, value);
                }}
              >
                {ButtonStyles.map((style) => (
                  <ToggleGroupItem
                    value={style}
                    aria-label={`Toggle ${style.toLowerCase()}`}
                    key={style}
                  >
                    {capitalize(style.toLowerCase())}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormDescription>The style of the button</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        {...buttonLens.focus("roleName").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>The role toggled by this button</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        {...buttonLens.focus("label").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>The button's label</FormDescription>
          </FormItem>
        )}
      />
      <EmojiEditor emojiContainerLens={buttonLens} />
    </div>
  );
}

function EmojiEditor<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const emojiWatch = useWatch({
    name: emojiContainerLens.focus("emoji").interop().name,
    control: emojiContainerLens.focus("emoji").interop().control,
  });

  return (
    <div className="flex">
      <TypeToggle emojiContainerLens={emojiContainerLens} />
      {emojiWatch?.type === "custom" ? (
        <CustomEmojiEditor
          emojiContainerLens={
            // @ts-expect-error Type asserted above
            emojiContainerLens as Lens<EmojiContainer<CustomEmoji>>
          }
        />
      ) : (
        <UnicodeEmojiEditor
          emojiContainerLens={
            // @ts-expect-error Type asserted above
            emojiContainerLens as Lens<EmojiContainer<UnicodeEmoji>>
          }
        />
      )}
    </div>
  );
}

function TypeToggle<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  // TODO another option is to use a toggle group: none | unicode | custom
  return (
    <FormField
      {...emojiContainerLens.focus("emoji.type").interop()}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Custom?</FormLabel>
          <FormControl>
            <Switch
              checked={field.value === "custom"}
              onCheckedChange={(e) =>
                e ? field.onChange("custom") : field.onChange("unicode")
              }
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

type EmojiContainer<T extends Emoji> = { emoji: T | null };

function UnicodeEmojiEditor<T extends EmojiContainer<UnicodeEmoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const emojiWatch = useWatch({
    name: emojiContainerLens.focus("emoji").interop().name,
    control: emojiContainerLens.focus("emoji").interop().control,
  });

  return (
    <FormField
      {...emojiContainerLens.focus("emoji.unicode").interop()}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unicode</FormLabel>
          <FormControl>
            <Input {...field} value={emojiWatch?.unicode ?? ""} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function CustomEmojiEditor<T extends EmojiContainer<CustomEmoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  return (
    <>
      <FormField
        {...emojiContainerLens.focus("emoji.name").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        {...emojiContainerLens.focus("emoji.discordId").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discord ID</FormLabel>
            <FormControl>
              <Input pattern="\d*" {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        {...emojiContainerLens.focus("emoji.animated").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Animated?</FormLabel>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
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

      <ButtonComponent onClick={handleButton}>Create config</ButtonComponent>
    </>
  );
}
