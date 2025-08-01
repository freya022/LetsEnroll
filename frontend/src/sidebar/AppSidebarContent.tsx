import DiscordLogoWhite from "@/assets/Discord-Symbol-White.svg?react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {
  ChevronDown,
  ExternalLink,
  Home,
  PenBox,
  WandSparkles,
} from "lucide-react";
import { GuildDTO } from "@/dto/GuildDTO.ts";
import {
  SidebarMenuNavLinkButton,
  SidebarMenuNavLinkSubButton,
} from "@/components/ui/sidebar-ext.tsx";
import { useMatch } from "react-router";

export default function AppSidebarContent({ guilds }: { guilds?: GuildDTO[] }) {
  return (
    <SidebarContent>
      <AppGroup />
      {guilds && <ConfigurationsGroup guilds={guilds} />}
    </SidebarContent>
  );
}

function AppGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Let's Enroll</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuNavLinkButton
              to="/"
              label="Home"
              icon={<Home aria-label="Home icon" />}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="bg-blurple hover:bg-blurple-accent text-white hover:text-white"
              asChild
            >
              <a
                href="https://discord.com/oauth2/authorize?client_id=1327727455716245564&permissions=268435456&integration_type=0&scope=bot"
                target="_blank"
              >
                <DiscordLogoWhite aria-label="Discord logo" />
                <span>Invite me</span>
                <ExternalLink
                  aria-label="External link icon"
                  className="ml-auto"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ConfigurationsGroup({ guilds }: { guilds: GuildDTO[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Configurations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {guilds.map((guild) => (
            <ConfigurationItem
              id={guild.id}
              name={guild.name}
              icon={guild.icon}
              key={guild.id}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ConfigurationItem({
  id,
  name,
  icon,
}: {
  id: string;
  name: string;
  icon: string;
}) {
  const thisGuildMatch = useMatch(`/dashboard/${id}/*`);

  return (
    <Collapsible
      defaultOpen={thisGuildMatch !== null}
      className={`group/collapsible-configuration`}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <img
              className="size-6 rounded-full border"
              alt={`Icon of ${name}`}
              src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp?animated=true`}
            />
            <span className="truncate text-nowrap select-none">{name}</span>
            <ChevronDown
              aria-label="Chevron"
              className={`ml-auto transition-transform group-data-[state=open]/collapsible-configuration:rotate-180`}
            />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuNavLinkSubButton
                to={`/dashboard/${id}/roles/edit`}
                label="Edit"
                icon={<PenBox aria-label="Pen icon" />}
              />
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuNavLinkSubButton
                to={`/dashboard/${id}/roles/publish`}
                label="Publish"
                icon={<WandSparkles aria-label="Wand icon" />}
              />
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
