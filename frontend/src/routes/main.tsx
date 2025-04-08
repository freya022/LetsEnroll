import { ComponentProps, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";
import Monocle from "@/assets/monocle.svg?react";
import Raised from "@/assets/raised.svg?react";
import Thinking from "@/assets/thinking.svg?react";

export default function Main() {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-center text-3xl font-semibold">Welcome!</h1>
        <p className="text-xl">
          Let's Enroll is a simple Discord bot to set up self-assigned roles on
          your server!
        </p>
      </div>
      <div className="grid max-w-4xl flex-col gap-4">
        <Article
          emoji={<Monocle />}
          heading="Features!"
          className="col-span-1 col-start-1 row-start-1 flex-1 md:col-span-2 md:col-start-1 md:row-start-1"
        >
          <p>
            Here you can fully customize the controls sent by the bot, such as:
          </p>
          <ul className={`list-image-[url('./assets/checkmark.svg')] pl-5`}>
            <li className="pl-1">Buttons for single-role toggles</li>
            <li className="list-image-[url('./assets/construction.svg')] pl-1">
              Select menus with multiple selectable choices
            </li>
            <li className="pl-1">
              Select menus with a single selectable from a list
            </li>
          </ul>
        </Article>
        <Article
          emoji={<Raised />}
          heading="But why?"
          className="col-start-1 row-start-2 flex-1 md:col-start-1 md:row-start-2"
        >
          <p>
            "<i>Another bot</i>" you say? Well yes, I needed one in my{" "}
            <BCLink content="lib" />
            's server, while browsing App Directory, I realised I didn't want
            the next all-in-one bot in my server, and the only one that didn't{" "}
            <HoverLabel
              label="require to know where I live"
              tooltip="read: request every permission"
            />{" "}
            was quite <i>suboptimal</i>.
          </p>
          <p>
            So... here it is, supporting my single guild, with of course,{" "}
            <OverengineeredFeatureLabel />, wouldn't really be my work if it
            wasn't overengineered in some way, huh?
          </p>
        </Article>
        <Article
          emoji={<Thinking />}
          heading="What about the website?"
          className="col-start-1 row-start-3 flex-1 md:col-start-2 md:row-start-2"
        >
          <p>
            Not so long after finishing the bot, I remembered the bot managing
            the notification roles in JDA no longer existed, so I just thought
            screw it, let's just make it configurable for any guild, in case
            they want to use it.
          </p>
          <p>
            <i>
              ...or maybe I just needed to do a full stack project for the
              experience.
            </i>
          </p>
        </Article>
      </div>
    </div>
  );
}

function Article({
  emoji,
  heading,
  children,
  className,
  ...props
}: ComponentProps<"article"> & { emoji: ReactNode; heading: ReactNode }) {
  return (
    <article
      {...props}
      className={cn(
        className,
        "flex flex-col gap-y-2 rounded-lg border-2 border-blue-900 p-3",
      )}
    >
      <h2 className="flex items-center justify-center gap-x-2 text-center text-2xl font-semibold">
        <div className="size-7">{emoji}</div>
        {heading}
      </h2>
      {children}
    </article>
  );
}

function HoverLabel({
  label,
  tooltip,
}: {
  label: ReactNode;
  tooltip: ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="border-b-foreground border-b-2 border-dotted">
          {label}
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function OverengineeredFeatureLabel() {
  return (
    <HoverLabel
      label="an overengineered feature"
      tooltip={
        <div className="flex flex-col gap-y-2">
          <p>
            Auto-generated implementations of interfaces with localized message
            getters,{" "}
            <a
              href="https://github.com/freya022/LetsEnroll/blob/7e06708c8e9f1e41765f42d4e2e15054ec3621d1/backend/bot/src/main/kotlin/dev/freya02/letsenroll/bot/localization/messages/MessageSourceFactoryClassGraphProcessor.kt"
              target="_blank"
              className="underline"
            >
              using proxies
            </a>
            .
          </p>
          <p>
            <i>
              Or, for the{" "}
              <a
                href="https://github.com/freya022/LetsEnroll/blob/7e06708c8e9f1e41765f42d4e2e15054ec3621d1/backend/bot/src/jmh/kotlin/dev/freya02/letsenroll/jmh/bot/localization/TestMessagesFactory.kt#L70-L194"
                target="_blank"
                className="underline"
              >
                fancy
              </a>
              ...
            </i>
          </p>
        </div>
      }
    />
  );
}

function BCLink({ content }: { content: string }) {
  return (
    <a
      href="https://github.com/freya022/BotCommands"
      target="_blank"
      className="underline"
    >
      {content}
    </a>
  );
}
