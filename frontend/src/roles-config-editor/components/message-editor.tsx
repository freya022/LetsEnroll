import { Lens } from "@hookform/lenses";
import { RoleMessage } from "@/dto/RolesConfigDTO.ts";
import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { ComponentEditor } from "@/roles-config-editor/components/component-editor.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/config-collapsible.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  getComponentCount,
  getRoleCount,
  useLensWatch,
} from "@/roles-config-editor/utils.ts";
import DeleteButton from "@/roles-config-editor/components/delete-button.tsx";

export function MessageEditor({
  messageLens,
  msgIndex,
  onMessageDelete,
}: {
  messageLens: Lens<RoleMessage>;
  msgIndex: number;
  onMessageDelete: () => void;
}) {
  const componentsLens = messageLens.focus("components");

  const {
    fields: componentFields,
    append: appendComponent,
    remove: removeComponent,
  } = useFieldArray({
    ...componentsLens.interop(),
    rules: {
      required: true,
    },
  });

  const components = useLensWatch(componentsLens);

  function handleAddRow() {
    appendComponent({
      type: "row",
      components: [],
    });
  }

  const componentCount = getComponentCount(components);
  const roleCount = getRoleCount(components);

  return (
    <ConfigCollapsible
      objectPath={messageLens.interop().name}
      header={
        componentCount == 0 ? (
          <FormMessage>
            Message #{msgIndex + 1} - Not configured yet
          </FormMessage>
        ) : (
          `Message #${msgIndex + 1} with ${componentCount} components, ${roleCount} roles`
        )
      }
      listName="choice config"
    >
      <FormField
        {...messageLens.focus("content").interop()}
        rules={{
          required: {
            value: true,
            message: "You must set the message content",
          },
          maxLength: {
            value: 100,
            message: "The content must not be longer than 2048 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content* (2048 characters max)</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              The main content of the message, can contain markdown, mentions
              and emojis
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {componentFields.map((component, componentIndex) => (
        <ComponentEditor
          componentLens={componentsLens.focus(`${componentIndex}`)}
          key={component.id}
          onComponentDelete={() => removeComponent(componentIndex)}
        />
      ))}
      <Button
        variant="secondary"
        type="button"
        onClick={handleAddRow}
        disabled={components.length >= 5}
      >
        Add row
      </Button>
      {components.length == 0 && (
        <FormMessage>A message must have at least one component</FormMessage>
      )}
      <DeleteButton name={"Message"} onDelete={onMessageDelete} />
    </ConfigCollapsible>
  );
}
