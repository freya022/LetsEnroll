import {
  CustomEmoji,
  Emoji,
  RolesConfig,
  UnicodeEmoji,
} from "@/dto/RolesConfigDTO.ts";
import { Lens } from "@hookform/lenses";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { ReactElement } from "react";

export function EmojiEditor<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const emojiWatch = useWatch({
    name: emojiContainerLens.focus("emoji").interop().name,
    control: emojiContainerLens.focus("emoji").interop().control,
  });

  let editor: ReactElement | undefined;
  if (!emojiWatch) {
    editor = undefined;
  } else if (emojiWatch.type === "custom") {
    editor = (
      <CustomEmojiEditor
        emojiContainerLens={
          // @ts-expect-error Type asserted above
          emojiContainerLens as Lens<EmojiContainer<CustomEmoji>>
        }
      />
    );
  } else {
    editor = (
      <UnicodeEmojiEditor
        emojiContainerLens={
          // @ts-expect-error Type asserted above
          emojiContainerLens as Lens<EmojiContainer<UnicodeEmoji>>
        }
      />
    );
  }

  return (
    <>
      <Label>Emoji</Label>
      <div className="flex">
        <TypeToggle emojiContainerLens={emojiContainerLens} />
        {editor}
      </div>
    </>
  );
}

type EmojiContainer<T extends Emoji> = { emoji: T | null };

function TypeToggle<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const form = useFormContext<RolesConfig>();
  const emoji = useWatch({
    name: emojiContainerLens.focus("emoji").interop().name,
    control: emojiContainerLens.focus("emoji").interop().control,
  });

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={emoji ? emoji.type : "none"}
      onValueChange={(value) => {
        let newEmoji: Emoji | null;
        if (value === "unicode") {
          newEmoji = {
            type: "unicode",
            unicode: "",
          };
        } else if (value === "custom") {
          newEmoji = {
            type: "custom",
            name: "",
            discordId: "",
            animated: false,
          };
        } else {
          newEmoji = null;
        }

        form.setValue(
          // @ts-expect-error It can only be an Emoji
          emojiContainerLens.focus("emoji").interop().name,
          newEmoji,
        );
      }}
    >
      <ToggleGroupItem value="none">None</ToggleGroupItem>
      <ToggleGroupItem value="unicode">Unicode</ToggleGroupItem>
      <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
    </ToggleGroup>
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
          <FormLabel>Unicode*</FormLabel>
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
            <FormLabel>Name*</FormLabel>
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
            <FormLabel>Discord ID*</FormLabel>
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
