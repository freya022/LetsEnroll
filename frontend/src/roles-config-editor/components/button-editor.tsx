import { Lens } from "@hookform/lenses";
import { Button, ButtonStyles, RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { capitalize } from "@/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { EmojiEditor } from "@/roles-config-editor/components/emoji-editor.tsx";
import DeleteButton from "@/roles-config-editor/components/delete-button.tsx";

export function ButtonEditor({
  buttonLens,
  onButtonDelete,
}: {
  buttonLens: Lens<Button>;
  onButtonDelete: () => void;
}) {
  const form = useFormContext<RolesConfig>();

  const label = useWatch({
    name: buttonLens.focus("label").interop().name,
    control: buttonLens.focus("label").interop().control,
  });
  const emoji = useWatch({
    name: buttonLens.focus("emoji").interop().name,
    control: buttonLens.focus("emoji").interop().control,
  });

  return (
    <>
      <FormField
        {...buttonLens.focus("style").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Style</FormLabel>
            <FormControl className="w-full">
              <ToggleGroup
                variant="outline"
                {...field}
                type="single"
                onValueChange={(value) => {
                  // @ts-expect-error Literally assigning itself with its own value type
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
              The role toggled by this button, it will be created if it does not
              exist
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        {...buttonLens.focus("label").interop()}
        rules={{
          validate: () => !(!label && !emoji),
          maxLength: {
            value: 80,
            message: "Label must be less than 80 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label (80 characters max)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>The button's label</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <EmojiEditor emojiContainerLens={buttonLens} />
      {!label && !emoji && (
        <h3 className={`text-destructive font-semibold`}>
          At least a label or an emoji must be set
        </h3>
      )}
      <DeleteButton name={"Button"} onDelete={onButtonDelete} />
    </>
  );
}
