import {
  CustomEmoji,
  Emoji,
  RolesConfig,
  UnicodeEmoji,
} from "@/dto/RolesConfigDTO.ts";
import { Lens } from "@hookform/lenses";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { ReactElement } from "react";
import { useLensWatch } from "@/roles-config-editor/utils.ts";

export function EmojiEditor<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const emojiWatch = useLensWatch(emojiContainerLens.focus("emoji"));

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
    <div className="grid grid-cols-[min-content_repeat(3,_1fr)] gap-x-2 gap-y-1">
      <FormLabel>Emoji</FormLabel>
      <TypeToggle emojiContainerLens={emojiContainerLens} />
      {editor}
    </div>
  );
}

type EmojiContainer<T extends Emoji> = { emoji: T | null };

function TypeToggle<T extends EmojiContainer<Emoji>>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const form = useFormContext<RolesConfig>();
  const emoji = useLensWatch(emojiContainerLens.focus("emoji"));

  return (
    <ToggleGroup
      className="col-start-1 row-start-2"
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
      <ToggleGroupItem value="none">No emoji</ToggleGroupItem>
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
  const emojiWatch = useLensWatch(emojiContainerLens.focus("emoji"));

  return (
    <FormField
      {...emojiContainerLens.focus("emoji.unicode").interop()}
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <>
          <FormLabel className="col-start-2">Unicode*</FormLabel>
          <FormControl className="col-start-2">
            <Input {...field} value={emojiWatch?.unicode ?? ""} />
          </FormControl>
        </>
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
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <>
            <FormLabel className="col-start-2 row-start-1">Name*</FormLabel>
            <FormControl className="col-start-2 row-start-2">
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
          </>
        )}
      />
      <FormField
        {...emojiContainerLens.focus("emoji.discordId").interop()}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <>
            <FormLabel className="col-start-3 row-start-1">
              Discord ID*
            </FormLabel>
            <FormControl className="col-start-3 row-start-2">
              <Input pattern="\d*" {...field} value={field.value ?? ""} />
            </FormControl>
          </>
        )}
      />
      <FormField
        {...emojiContainerLens.focus("emoji.animated").interop()}
        render={({ field }) => (
          <FormItem className="col-start-4 row-start-2 flex items-center">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="col-start-4 row-start-1">Animated?</FormLabel>
          </FormItem>
        )}
      />
    </>
  );
}
