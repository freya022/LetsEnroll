import { ComponentProps, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";

export function Main() {
  return (
    <div className="flex flex-col items-center gap-y-14">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-center text-3xl font-semibold">Welcome!</h1>
        <p className="text-xl">
          Commandinator is a simple bot to set up self-assigned roles on your
          server!
        </p>
      </div>
      <div className="flex max-w-7xl flex-col gap-4 px-4 lg:flex-row">
        <Article>
          <h2 className="text-center text-2xl font-semibold">Features!</h2>
          <p>
            This website enables you to configure the controls sent by the bot,
            such as:
          </p>
          <ul className={`list-image-[url('./assets/checkmark.svg')] pl-5`}>
            <li className="pl-1">Buttons for single-role toggles</li>
            <li className="pl-1">
              Select menus with any selectable role choices
            </li>
            <li className="pl-1">
              Select menus with a single selectable from a list
            </li>
          </ul>
          <p>You can, of course, customize every aspect of these components.</p>
        </Article>
        <Article>
          <h2 className="text-center text-2xl font-semibold">But why?</h2>
          <p>
            "<i>Another bot</i>" you say? Well yes, I needed one in my{" "}
            <BCLink content="lib" />
            's server, while browsing App Directory, I realised I didn't want
            the next all-in-one bot in my server, and the only one that didn't{" "}
            <HoverLabel
              label="require to know where I live"
              tooltip="read: request every permission"
            />{" "}
            was quite <i>suboptimal</i>, so... here I am.
          </p>
          <p>
            And that's how this bot was born, supporting my single guild, with
            of course, <OverengineeredFeatureLabel />, wouldn't really be my
            work if it wasn't overengineered in some way, huh?
          </p>
        </Article>
        <Article>
          <h2 className="text-center text-2xl font-semibold">
            What about the website?
          </h2>
          <p>
            Not so long after finishing the bot, I remembered the bot managing
            the notification roles in JDA no longer existed, so I just thought
            screw it, let's just make it configurable for any guild, in case
            they want to use it.
          </p>
          <p>
            <i>
              It's actually an excuse to seriously attempt web development
              outside of university, but shh.
            </i>
          </p>
        </Article>
      </div>
    </div>
  );
}

function Article({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      {...props}
      className={cn(
        className,
        "flex flex-1 flex-col gap-y-2 rounded-lg border-2 border-blue-900 p-2",
      )}
    />
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
              href="https://github.com/freya022/Commandinator/blob/db4ae1bf1c486765e7264f300f5ac142b557ed31/bot/src/main/kotlin/dev/freya02/commandinator/bot/localization/messages/MessageSourceFactoryClassGraphProcessor.kt"
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
                href="https://github.com/freya022/Commandinator/blob/db4ae1bf1c486765e7264f300f5ac142b557ed31/bot/src/jmh/kotlin/dev/freya02/commandinator/jmh/bot/localization/TestMessagesFactory.kt#L70-L194"
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
