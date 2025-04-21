import { RolesConfig } from "@/dto/RolesConfigDTO.ts";
import { Lens } from "@hookform/lenses";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useState } from "react";
import { useSelectedGuild } from "@/roles-config-editor/utils.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import axios from "axios";
import { ChevronsUpDown, X } from "lucide-react";
import { capitalize } from "@/utils.ts";
import {
  CustomEmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/roles-config-editor/types.ts";
import { getUnicodeEmojiSrc } from "@/emoji-picker/utils.ts";
import { EmojiPicker } from "@/emoji-picker/components/emoji-picker.tsx";

type EmojiContainer = { emoji: string | null };

export function EmojiEditor<T extends EmojiContainer>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const { id: guildId } = useSelectedGuild();
  const form = useFormContext<RolesConfig>();

  const { data: unicodeEmojis } = useSuspenseQuery({
    queryKey: ["unicode_emojis"],
    queryFn: async () => {
      const response = await axios.get("/api/emojis");
      return response.data as UnicodeEmojiCandidate[];
    },
    // Unicode emojis are never outdated
    staleTime: Infinity,
  });

  const { data: customEmojis } = useSuspenseQuery({
    queryKey: ["custom_emojis", guildId],
    queryFn: async () => {
      const response = await axios.get(`/api/guilds/${guildId}/emojis`);
      return response.data as CustomEmojiCandidate[];
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <div>
      <FormField
        {...emojiContainerLens.focus("emoji").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emoji</FormLabel>
            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger className="grow" asChild>
                  <FormControl>
                    <Button
                      role="combobox"
                      aria-expanded={open}
                      id="channel-selector"
                      variant="secondary"
                      className="justify-between"
                      type="button"
                    >
                      {field.value ? (
                        <SelectedEmoji
                          formattedEmoji={field.value}
                          unicodeEmojis={unicodeEmojis}
                          customEmojis={customEmojis}
                        />
                      ) : (
                        "No emoji"
                      )}
                      <ChevronsUpDown
                        aria-label="Channel selector chevrons"
                        className="opacity-50"
                      />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <EmojiPicker
                    unicodeEmojis={unicodeEmojis}
                    customEmojis={customEmojis}
                    onSelect={(formattedEmoji) => {
                      form.setValue(
                        // @ts-expect-error Path is correct
                        field.name,
                        formattedEmoji,
                        {
                          shouldDirty: true,
                        },
                      );
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <X
                role="button"
                aria-label="Remove emoji"
                className="text-destructive hover:bg-accent size-9 cursor-pointer rounded-sm"
                onClick={() => {
                  form.setValue(
                    // @ts-expect-error Path is correct
                    field.name,
                    null,
                    {
                      shouldDirty: true,
                    },
                  );
                }}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function SelectedEmoji({
  formattedEmoji,
  unicodeEmojis,
  customEmojis,
}: {
  formattedEmoji: string;
  unicodeEmojis: UnicodeEmojiCandidate[];
  customEmojis: CustomEmojiCandidate[];
}) {
  const customMatch = formattedEmoji.match(/<a?:\w+:(\d+)>/);
  if (customMatch) {
    const id = customMatch[1];
    const emoji = customEmojis.find((e) => e.id === id)!;

    const alt = `'${emoji.name}' emoji`;
    const src = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?animated=true`;
    return (
      <div className="flex items-center gap-2">
        <img src={src} alt={alt} className="size-6" />
        {emoji.name}
      </div>
    );
  } else {
    const emoji = unicodeEmojis.find(
      (e) =>
        e.unicode === formattedEmoji || e.variants.includes(formattedEmoji),
    )!;

    const humanAlias = emoji.aliases[0].replace(/:/g, "").replace(/_/g, " ");
    const alt = `'${humanAlias}' emoji`;
    const src = getUnicodeEmojiSrc(formattedEmoji);
    return (
      <div className="flex items-center gap-2">
        <img src={src} alt={alt} className="size-6" />
        {capitalize(humanAlias)}
      </div>
    );
  }
}
