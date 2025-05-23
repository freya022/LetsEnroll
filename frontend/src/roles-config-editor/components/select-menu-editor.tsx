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
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { EmojiEditor } from "@/roles-config-editor/components/emoji-editor.tsx";
import { ConfigCollapsible } from "@/roles-config-editor/components/config-collapsible.tsx";
import DeleteButton from "@/roles-config-editor/components/delete-button.tsx";
import { useLensWatch } from "@/roles-config-editor/utils.ts";

export function SelectMenuEditor({
  selectMenuLens,
  onSelectMenuDelete,
}: {
  selectMenuLens: Lens<SelectMenu>;
  onSelectMenuDelete: () => void;
}) {
  const choicesLens = selectMenuLens.focus("choices");

  const {
    fields: choiceFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
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
    <>
      <FormField
        {...selectMenuLens.focus("placeholder").interop()}
        rules={{
          maxLength: {
            value: 100,
            message: "Placeholder must be less than 100 characters",
          },
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
          onChoiceDelete={() => removeChoice(choiceIndex)}
          key={choice.id}
        />
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={handleCreateChoice}
        disabled={choiceFields.length >= 25}
      >
        Create choice
      </Button>
      {choiceFields.length < 2 && (
        <FormMessage>A select menu must have at least two choices</FormMessage>
      )}
      <DeleteButton name={"Select Menu"} onDelete={onSelectMenuDelete} />
    </>
  );
}

function SelectMenuChoiceEditor({
  choiceLens,
  onChoiceDelete,
}: {
  choiceLens: Lens<SelectMenuChoice>;
  onChoiceDelete: () => void;
}) {
  const choice = useLensWatch(choiceLens);

  return (
    <ConfigCollapsible
      objectPath={choiceLens.interop().name}
      header={
        choice.roleName.trim().length == 0 ? (
          <FormMessage>Choice - Not configured yet</FormMessage>
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
          maxLength: {
            value: 100,
            message: "The role name must not be longer than 100 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role name* (100 characters max)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              The role toggled by this choice, it will be created if it does not
              exist
            </FormDescription>
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
      <DeleteButton name={"Choice"} onDelete={onChoiceDelete} />
    </ConfigCollapsible>
  );
}
