import { Lens } from "@hookform/lenses";
import { RoleMessage } from "@/dto/RolesConfigDTO.ts";
import { useFieldArray, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { ComponentEditor } from "@/roles-config-editor/components/ComponentEditor.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/ConfigCollapsible.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  getComponentCount,
  getRoleCount,
} from "@/roles-config-editor/utils.ts";

export function MessageEditor({
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
    </ConfigCollapsible>
  );
}
