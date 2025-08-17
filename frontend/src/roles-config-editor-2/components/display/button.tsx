import { cn } from "@/lib/utils.ts";
import { UnicodeEmoji } from "@/emoji-picker/components/unicode-emoji.tsx";
import { ButtonData } from "@/roles-config-editor-2/types/components.ts";
import Properties from "@/roles-config-editor-2/components/properties/base/properties.tsx";
import ButtonProperties from "@/roles-config-editor-2/components/properties/button.tsx";
import { useMutableSelectedNode } from "@/roles-config-editor-2/hooks/selected-node-context.ts";
import { MouseEvent } from "react";
import Emoji from "@/emoji-picker/components/emoji.tsx";
import {
  CustomEmojiCandidate,
  UnicodeEmojiCandidate,
} from "@/emoji-picker/types/emojis.ts";
import { Controls } from "@/roles-config-editor-2/components/properties/types/controls.ts";
import { createPortal } from "react-dom";
import { usePropertiesPanel } from "@/roles-config-editor-2/hooks/properties-panel.ts";

export default function Button({
  button,
  controls,
  hasError,
}: {
  button: ButtonData;
  controls: Controls<ButtonData>;
  hasError: boolean;
}) {
  const { selectedNode, setSelectedNode } = useMutableSelectedNode();
  const propPanel = usePropertiesPanel();

  function handleButtonClick(e: MouseEvent) {
    e.stopPropagation();
    setSelectedNode({
      id: button.id,
    });
  }

  return (
    <button
      className={cn(
        "flex h-8 cursor-pointer items-center gap-x-1 rounded-[8px] border-[0.8px] px-[11px] py-[3px] outline-offset-1",
        button.style === "PRIMARY" &&
          "bg-discord-button-background-primary border-discord-button-border-primary text-discord-button-foreground-primary hover:bg-discord-button-accent-primary",
        button.style === "SECONDARY" &&
          "bg-discord-button-background-secondary border-discord-button-border-secondary text-discord-button-foreground-secondary hover:bg-discord-button-accent-secondary",
        button.style === "SUCCESS" &&
          "bg-discord-button-background-success border-discord-button-border-success text-discord-button-foreground-success hover:bg-discord-button-accent-success",
        button.style === "DANGER" &&
          "bg-discord-button-background-danger border-discord-button-border-danger text-discord-button-foreground-danger hover:bg-discord-button-accent-danger",
        hasError &&
          selectedNode?.id !== button.id &&
          "outline-destructive outline-2",
        selectedNode?.id === button.id &&
          "outline-ring outline-2 outline-offset-1",
      )}
      onClick={handleButtonClick}
    >
      <Emoji
        formattedEmoji={button.emoji}
        onUnicode={ButtonUnicodeEmoji}
        onCustom={ButtonCustomEmoji}
        onUnknown={() => {
          if (button.emoji != null) controls.update({ ...button, emoji: null });
          return <></>;
        }}
      />
      <span className="text-sm font-semibold">{button.label}</span>
      {selectedNode?.id === button.id &&
        propPanel &&
        createPortal(
          <ButtonPropertiesPanel button={button} controls={controls} />,
          propPanel,
        )}
    </button>
  );
}

function ButtonUnicodeEmoji({
  emoji,
  fitzpatrickIndex,
}: {
  emoji: UnicodeEmojiCandidate;
  fitzpatrickIndex: number;
}) {
  return (
    <UnicodeEmoji
      emoji={emoji}
      fitzpatrickIndex={fitzpatrickIndex}
      emojiSize={20}
    />
  );
}

function ButtonCustomEmoji({ emoji }: { emoji: CustomEmojiCandidate }) {
  const alt = `'${emoji.name}' emoji`;
  const src = `https://cdn.discordapp.com/emojis/${emoji.id}.webp?animated=true`;
  return <img src={src} alt={alt} className="size-5" />;
}

function ButtonPropertiesPanel({
  button,
  controls,
}: {
  button: ButtonData;
  controls: Controls<ButtonData>;
}) {
  return (
    <Properties name="Button" onDelete={() => {}}>
      <ButtonProperties button={button} controls={controls} />
    </Properties>
  );
}
