import { cn } from "@/lib/utils.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";
import { unicodeEmojis } from "@/emoji-picker/unicode-emojis.ts";

export default function Button({ hasError }: { hasError: boolean }) {
  return (
    <button
      className={cn(
        "flex h-8 cursor-pointer items-center gap-x-1 rounded-[8px] border-0 bg-[rgb(0,134,58)] px-[11px] py-[3px] outline-offset-1 hover:bg-[#047e37]",
        hasError && "outline-destructive outline-2",
      )}
    >
      <UnicodeEmoji
        emoji={unicodeEmojis.find((emoji) => emoji.names.includes("bell"))!}
        emojiSize={20}
        fitzpatrickIndex={0}
      />
      <span className="text-sm font-semibold">Toggle BC update pings</span>
    </button>
  );
}
