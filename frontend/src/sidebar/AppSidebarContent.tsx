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
import { ChevronDown, ExternalLink, Home } from "lucide-react";
import { NavLink, To } from "react-router";
import { ReactNode } from "react";
import { GuildDTO } from "@/dto/GuildDTO.ts";

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
            <SidebarMenuNavLink to="/">
              <SidebarMenuButton className="cursor-pointer">
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuNavLink>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="bg-[hsl(235,86%,65%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(235,86%,60%)] hover:text-[hsl(0,0%,100%)]"
              asChild
            >
              <a
                href="https://discord.com/oauth2/authorize?client_id=1327727455716245564&permissions=268435456&integration_type=0&scope=bot"
                target="_blank"
              >
                <DiscordLogoWhite aria-label="Discord logo" />
                <span>Invite me</span>
                <ExternalLink className="ml-auto" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarMenuNavLink({ to, children }: { to: To; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isPending }) =>
        [
          "transition-opacity delay-50 duration-200 ease-in-out",
          // is(Not)Active prevents the animation when loading a child route
          isPending ? "opacity-25" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
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
  return (
    <Collapsible className={`group/collapsible-configuration`}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <img
              className="size-6 rounded-full border"
              alt={`Icon of ${name}`}
              src={`https://cdn.discordapp.com/icons/${id}/${icon}.webp?animated=true`}
            />
            <span className="truncate text-nowrap">{name}</span>
            <ChevronDown
              className={`ml-auto transition-transform group-data-[state=open]/collapsible-configuration:rotate-180`}
            />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuNavLink to={`/dashboard/${id}/roles/edit`}>
                <SidebarMenuSubButton>Edit</SidebarMenuSubButton>
              </SidebarMenuNavLink>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuNavLink to={`/dashboard/${id}/roles/publish`}>
                <SidebarMenuSubButton>Publish</SidebarMenuSubButton>
              </SidebarMenuNavLink>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
