import {
  CustomEmojiCandidate,
  EmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/roles-config-editor/types.ts";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { FixedSizeGrid } from "react-window";
import {
  getAliases,
  getEmojiSrc,
  getFormatted,
  getUnicodeVariant,
  removeEmoticons,
} from "@/emoji-picker/utils.ts";
import { FitzpatrickPicker } from "@/emoji-picker/components/fitzpatrick-picker.tsx";

const columns = 9;

const emojiSize = 32;
const paddingSize = 2 * 4;
const itemSize = emojiSize + paddingSize;

export function EmojiPicker({
  unicodeEmojis,
  customEmojis,
  onSelect,
}: {
  unicodeEmojis: UnicodeEmojiCandidate[];
  customEmojis: CustomEmojiCandidate[];
  onSelect: (formattedEmoji: string) => void;
}) {
  const mergedEmojis: EmojiCandidate[] = [...customEmojis, ...unicodeEmojis];

  const [fitzpatrickIndex, setFitzpatrickIndex] = useState(0);
  const [hoveredEmojiAlias, setHoveredEmojiAlias] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>();

  const filteredEmojis = searchQuery
    ? mergedEmojis.filter((e) =>
        getAliases(e).some((alias) => alias.includes(searchQuery)),
      )
    : mergedEmojis;

  function findEmoji(col: number, row: number): EmojiCandidate | null {
    const index = col + row * columns;
    if (index >= filteredEmojis.length) return null;

    return filteredEmojis[index];
  }

  // useMemo() will ensure the type does not get recreated each render pass.
  // This also fixes scrolling glitching out
  const OuterElementType = useMemo(
    () => (props: object) => <div {...props} tabIndex={-1} />,
    [],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-2">
        <input
          placeholder={hoveredEmojiAlias ? hoveredEmojiAlias : "Search emojis"}
          className="grow rounded-md border p-1.5 focus:outline-2"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FitzpatrickPicker
          fitzpatrickIndex={fitzpatrickIndex}
          setFitzpatrickIndex={setFitzpatrickIndex}
        />
      </div>
      <Separator orientation="horizontal" />
      <FixedSizeGrid
        outerElementType={OuterElementType}
        columnCount={columns}
        columnWidth={itemSize}
        height={itemSize * 5}
        rowCount={filteredEmojis.length / columns + 1}
        rowHeight={itemSize}
        width={columns * (itemSize + 2)}
        itemKey={({ columnIndex, rowIndex }) => {
          const emoji = findEmoji(columnIndex, rowIndex);
          if (!emoji) return columnIndex + rowIndex * columns;

          return "unicode" in emoji
            ? getUnicodeVariant(emoji, fitzpatrickIndex)
            : emoji.id;
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          const emoji = findEmoji(columnIndex, rowIndex);
          if (!emoji) return <></>;

          return (
            <div
              role="button"
              style={style}
              className="hover:bg-accent cursor-pointer rounded-sm p-1 -outline-offset-2 focus:outline-2"
              tabIndex={0}
              onClick={() => onSelect(getFormatted(emoji, fitzpatrickIndex))}
              onMouseEnter={() =>
                setHoveredEmojiAlias(() =>
                  removeEmoticons(getAliases(emoji)).join(" "),
                )
              }
              onMouseLeave={() => setHoveredEmojiAlias(() => undefined)}
              onKeyDown={(e) => {
                if (e.code.endsWith("Enter"))
                  onSelect(getFormatted(emoji, fitzpatrickIndex));
              }}
            >
              {"unicode" in emoji ? (
                <UnicodeEmojiImg
                  emoji={emoji}
                  fitzpatrickIndex={fitzpatrickIndex}
                />
              ) : (
                <CustomEmojiImg emoji={emoji} />
              )}
            </div>
          );
        }}
      </FixedSizeGrid>
    </div>
  );
}

function UnicodeEmojiImg({
  emoji,
  fitzpatrickIndex,
}: {
  emoji: UnicodeEmojiCandidate;
  fitzpatrickIndex: number;
}) {
  const alt = `'${emoji.aliases[0].replace(/:/g, "").replace(/_/g, " ")}' emoji`;
  const src = getEmojiSrc(emoji, fitzpatrickIndex);
  return <img src={src} alt={alt} className="size-8 object-contain" />;
}

function CustomEmojiImg({ emoji }: { emoji: CustomEmojiCandidate }) {
  const alt = `'${emoji.name}' emoji`;
  const src = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?animated=true`;
  return <img src={src} alt={alt} className="size-8 object-contain" />;
}
