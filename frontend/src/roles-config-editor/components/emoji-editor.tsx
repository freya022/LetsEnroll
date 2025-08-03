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
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import axios from "axios";
import { ChevronsUpDown, X } from "lucide-react";
import { CustomEmojiCandidate } from "@/emoji-picker/types/emojis.ts";
import { EmojiPicker } from "@/emoji-picker/components/emoji-picker.tsx";
import { useSelectedGuild } from "@/roles-config-editor/hooks/use-selected-guild.ts";
import { getHumanName, unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";

type EmojiContainer = { emoji: string | null };

export function EmojiEditor<T extends EmojiContainer>({
  emojiContainerLens,
}: {
  emojiContainerLens: Lens<T>;
}) {
  const { id: guildId } = useSelectedGuild();
  const form = useFormContext<RolesConfig>();

  const { data: customEmojis } = useSuspenseQuery({
    queryKey: ["custom_emojis", guildId],
    queryFn: async () => {
      const response = await axios.get(`/api/guilds/${guildId}/emojis`);
      return response.data as CustomEmojiCandidate[];
    },
    // The user could add an emoji and then come back here
    refetchOnWindowFocus: "always",
  });

  const [open, setOpen] = useState(false);

  return (
    <div>
      <FormField
        {...emojiContainerLens.focus("emoji").interop()}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Emoji</FormLabel>
            <FormControl>
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
                  tabIndex={0}
                  aria-label="Remove emoji"
                  className="text-destructive hover:bg-accent size-9 cursor-pointer rounded-sm focus:outline-2"
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function SelectedEmoji({
  formattedEmoji,
  customEmojis,
}: {
  formattedEmoji: string;
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
        <span>{emoji.name}</span>
      </div>
    );
  } else {
    const emoji = unicodeEmojis.find(
      (e) =>
        e.unicode === formattedEmoji || e.variants.includes(formattedEmoji),
    )!;
    // +1 because 0 is the default diversity, which is the emoji object itself,
    // equivalent to [emoji.unicode, ...emoji.variants].indexOf(formattedEmoji)
    const fitzpatrickIndex = emoji.variants.indexOf(formattedEmoji) + 1;

    return (
      <div className="flex items-center gap-2">
        <UnicodeEmoji
          emoji={emoji}
          fitzpatrickIndex={fitzpatrickIndex}
          emojiSize={24}
        />
        <span>{getHumanName(emoji)}</span>
      </div>
    );
  }
}
