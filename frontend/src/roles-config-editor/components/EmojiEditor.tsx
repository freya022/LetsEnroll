import { CustomEmoji, Emoji, UnicodeEmoji } from "@/dto/RolesConfigDTO.ts";
import { Lens } from "@hookform/lenses";
import { useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function EmojiEditor<T extends EmojiContainer<Emoji>>({
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

type EmojiContainer<T extends Emoji> = { emoji: T | null };

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
