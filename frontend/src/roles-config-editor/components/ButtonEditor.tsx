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
import { EmojiEditor } from "@/roles-config-editor/components/EmojiEditor.tsx";

export function ButtonEditor({ buttonLens }: { buttonLens: Lens<Button> }) {
  const form = useFormContext<RolesConfig>();

  const emoji = useWatch({
    name: buttonLens.focus("emoji").interop().name,
    control: buttonLens.focus("emoji").interop().control,
  });

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
        rules={{
          required: { value: true, message: "You must specify a role name" },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role name*</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>The role toggled by this button</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        {...buttonLens.focus("label").interop()}
        rules={{
          validate: (value) => {
            // TODO emoji is defined but empty..., reset to null when EmojiEditor gets changed to "none"
            if (!value && !emoji)
              return "There must be either a label or an emoji";

            return undefined;
          },
          maxLength: {
            value: 80,
            message: "Label must be less than 80 characters",
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>The button's label</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <EmojiEditor emojiContainerLens={buttonLens} />
    </div>
  );
}
