import { Lens } from "@hookform/lenses";
import { Component, RoleMessage } from "@/dto/RolesConfigDTO.ts";
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
import { Button } from "@/components/ui/button.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/ConfigCollapsible.tsx";

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
      header={
        componentCount == 0 ? (
          <FormMessage>Not configured yet</FormMessage>
        ) : (
          `Message with ${componentCount} components, ${roleCount} roles`
        )
      }
      listName="choice config"
    >
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
          key={component.id}
        />
      ))}
      <Button variant="secondary" type="button" onClick={handleAddRow}>
        Add row
      </Button>
      {components.length == 0 && (
        <FormMessage>A message must have at least one component</FormMessage>
      )}
    </ConfigCollapsible>
  );
}

function getComponentCount(component: Component | Component[]): number {
  if (component instanceof Array) {
    return component.reduce(
      (count, nestedComponent) => count + getComponentCount(nestedComponent),
      0,
    );
  }

  switch (component.type) {
    case "row":
      return getComponentCount(component.components);
    case "button":
      return 1;
    case "string_select_menu":
      return 1;
  }
}

function getRoleCount(component: Component | Component[]): number {
  if (component instanceof Array) {
    return component.reduce(
      (count, nestedComponent) => count + getRoleCount(nestedComponent),
      0,
    );
  }

  switch (component.type) {
    case "row":
      return getRoleCount(component.components);
    case "button":
      return 1;
    case "string_select_menu":
      return component.choices.length;
  }
}
