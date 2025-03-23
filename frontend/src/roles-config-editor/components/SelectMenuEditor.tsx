import { SelectMenu, SelectMenuChoice } from "@/dto/RolesConfigDTO.ts";
import { Lens } from "@hookform/lenses";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { EmojiEditor } from "@/roles-config-editor/components/EmojiEditor.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/ConfigCollapsible.tsx";

export function SelectMenuEditor({
  selectMenuLens,
}: {
  selectMenuLens: Lens<SelectMenu>;
}) {
  const choicesLens = selectMenuLens.focus("choices");

  const { fields: choiceFields, append: appendChoice } = useFieldArray({
    ...choicesLens.interop(),
    rules: { required: true },
  });

  function handleCreateChoice() {
    appendChoice({
      roleName: "",
      label: "",
      description: null,
      emoji: null,
    });
  }

  return (
    <div>
      <FormField
        {...selectMenuLens.focus("placeholder").interop()}
        rules={{
          maxLength: 100,
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placeholder (100 characters max)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>
              The text displayed when no value is selected
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {choiceFields.map((choice, choiceIndex) => (
        <SelectMenuChoiceEditor
          choiceLens={choicesLens.focus(`${choiceIndex}`)}
          key={choice.id}
        />
      ))}
      <Button type="button" variant="secondary" onClick={handleCreateChoice}>
        Create choice
      </Button>
      {choiceFields.length < 2 && (
        <FormMessage>A select menu must have at least two choices</FormMessage>
      )}
      {choiceFields.length > 25 && (
        <FormMessage>A select menu must have at most 25 choices</FormMessage>
      )}
    </div>
  );
}

function SelectMenuChoiceEditor({
  choiceLens,
}: {
  choiceLens: Lens<SelectMenuChoice>;
}) {
  const choice = useWatch({
    name: choiceLens.interop().name,
    control: choiceLens.interop().control,
  });

  return (
    <ConfigCollapsible
      header={
        choice.roleName.trim().length == 0 ? (
          <FormMessage>Not configured yet</FormMessage>
        ) : (
          `Choice for '${choice.roleName}'`
        )
      }
      listName="choice config"
    >
      <FormField
        {...choiceLens.focus("roleName").interop()}
        rules={{
          required: { value: true, message: "You must specify a role name" },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role name*</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>The role toggled by this choice</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        {...choiceLens.focus("label").interop()}
        rules={{
          required: { value: true, message: "You must set a label" },
          maxLength: {
            value: 100,
            message: "Label must be less than 100 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label* (100 characters max)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>Choice's label</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        {...choiceLens.focus("description").interop()}
        rules={{
          maxLength: {
            value: 100,
            message: "Description must be less than 100 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (100 characters max)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>Choice's description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <EmojiEditor emojiContainerLens={choiceLens} />
    </ConfigCollapsible>
  );
}
