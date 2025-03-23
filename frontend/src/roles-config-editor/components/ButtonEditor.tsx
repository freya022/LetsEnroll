import { Lens } from "@hookform/lenses";
import { Button, ButtonStyles, RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { capitalize } from "@/utils.ts";
import { Input } from "@/components/ui/input.tsx";
import { EmojiEditor } from "@/roles-config-editor/components/EmojiEditor.tsx";

export function ButtonEditor({ buttonLens }: { buttonLens: Lens<Button> }) {
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
