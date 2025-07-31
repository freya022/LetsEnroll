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

export default function AppSidebarContent() {
  return (
    <SidebarContent>
      <AppGroup />
      <ConfigurationsGroup />
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

function ConfigurationsGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Configurations</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <ConfigurationItem
            name="Testing"
            iconUrl="https://cdn.discordapp.com/icons/722891685755093072/34a403cedaab118d14a0c1560d1af674.webp?animated=true"
          />
          <ConfigurationItem
            name="Yet another JDA framework"
            iconUrl="https://cdn.discordapp.com/icons/848502702731165738/18dbb344401341508195f33e605d1e73.webp?animated=true"
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ConfigurationItem({
  name,
  iconUrl,
}: {
  name: string;
  iconUrl: string;
}) {
  return (
    <Collapsible className={`group/collapsible-configuration`}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton>
            <img
              className="size-6 rounded-full border"
              alt={`Icon of ${name}`}
              src={iconUrl}
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
              <SidebarMenuSubButton>Edit</SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton>Publish</SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
