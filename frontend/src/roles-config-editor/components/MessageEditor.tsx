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
import { Input } from "@/components/ui/input.tsx";
import { ComponentEditor } from "@/roles-config-editor/components/ComponentEditor.tsx";
import { Button as ButtonComponent } from "@/components/ui/button.tsx";

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
