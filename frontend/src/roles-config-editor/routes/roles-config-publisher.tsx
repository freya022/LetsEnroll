import {
  ActionFunctionArgs,
  Params as RouteParams,
  useFetcher,
  useLoaderData,
} from "react-router";
import axios, { AxiosError } from "axios";
import { ChannelDTO } from "@/dto/ChannelDTO.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { useSelectedGuild } from "@/roles-config-editor/utils.ts";
import { getErrorMessage } from "@/utils.ts";

type Params = {
  guildId: string;
};

type Props = {
  channels: ChannelDTO[];
};

async function loader({ params }: { params: RouteParams }): Promise<Props> {
  const { guildId } = params as Params;

  return {
    channels: await axios
      .get(`/api/guilds/${guildId}/channels`)
      .then((res) => res.data as ChannelDTO[]),
  };
}

RolesConfigPublisher.loader = loader;

type ActionReturnArgs = {
  error?: AxiosError;
};

async function action({
  request,
  params: { guildId },
}: ActionFunctionArgs): Promise<ActionReturnArgs> {
  const data = await request.json();

  try {
    await axios.post(`/api/guilds/${guildId}/roles/publish`, data);
  } catch (e) {
    return { error: e as AxiosError };
  }

  return {};
}

RolesConfigPublisher.action = action;

export default function RolesConfigPublisher() {
  const guild = useSelectedGuild();

  const [selectedChannel, setSelectedChannel] = useState<ChannelDTO>();

  const fetcher = useFetcher<ActionReturnArgs>();

  async function handlePublish() {
    await fetcher.submit(
      { channelId: selectedChannel!.id },
      {
        method: "post",
        encType: "application/json",
      },
    );
  }

  // TODO show roles-to-be-published, show as nested for select menu choices
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-full w-max flex-col items-center justify-center gap-y-4">
        <h3 className="text-2xl font-semibold">
          Publish role selectors for '{guild.name}'
        </h3>
        <Separator />
        <div>
          <ChannelSelector
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
          />
          {fetcher.state !== "idle" ? (
            <Button className="ml-2 w-28" disabled>
              Publishing...
            </Button>
          ) : (
            <Button
              className="ml-2 w-28"
              disabled={selectedChannel === undefined}
              onClick={handlePublish}
            >
              Publish
            </Button>
          )}

          {fetcher.state !== "idle" ? (
            <p className="min-h-6" />
          ) : fetcher.data?.error ? (
            <p className="text-destructive">
              An error occurred: {getErrorMessage(fetcher.data.error)}
            </p>
          ) : fetcher.data && fetcher.data.error === undefined ? (
            <p className="text-green-500">Published!</p>
          ) : (
            <p className="min-h-6" />
          )}
        </div>
      </div>
    </div>
  );
}

function ChannelSelector({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: ChannelDTO | undefined;
  setSelectedChannel: (channel: ChannelDTO) => void;
}) {
  const { channels } = useLoaderData<Props>();
  const [open, setOpen] = useState(false);

  // TODO responsive https://ui.shadcn.com/docs/components/combobox#responsive
  return (
    <>
      <label htmlFor="channel-selector">Channel </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-3xs" asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            id="channel-selector"
            variant="secondary"
            className="justify-between"
          >
            {selectedChannel ? selectedChannel.name : "Select channel..."}
            <ChevronsUpDown
              aria-label="Channel selector chevrons"
              className="opacity-50"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-3xs">
          <Command>
            <CommandInput placeholder="Search channel..." />
            <CommandList>
              <CommandEmpty>No channel found.</CommandEmpty>
              {channels.map((channel) => (
                <CommandItem
                  key={channel.id}
                  value={channel.id}
                  onSelect={() => {
                    setSelectedChannel(channel);
                    setOpen(false);
                  }}
                >
                  {channel.name}
                  {channel === selectedChannel && <Check className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
