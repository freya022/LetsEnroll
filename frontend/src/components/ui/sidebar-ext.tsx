import { NavLink, NavLinkRenderProps, To } from "react-router";
import * as React from "react";
import { ReactElement } from "react";
import {
  SidebarMenuButton,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar.tsx";
import { cn } from "@/lib/utils.ts";
import Spinner from "@/assets/spinner.svg?react";

export function SidebarMenuNavLink({
  to,
  children,
}: {
  to: To;
  children: React.ReactNode | ((props: NavLinkRenderProps) => React.ReactNode);
}) {
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
      children={children}
    />
  );
}

export function SidebarMenuNavLinkButton({
  label,
  icon,
  props: { isPending, isActive },
}: {
  label: string;
  icon?: ReactElement;
  props: NavLinkRenderProps;
}) {
  return (
    <SidebarMenuButton
      className={cn(
        "cursor-pointer",
        isActive && "bg-accent/60 outline-ring/40 outline-1",
      )}
    >
      {icon}
      <span>{label}</span>
      {isPending && (
        <div className="flex grow justify-end">
          <Spinner
            aria-label="Loading animation"
            className="dark:stroke-foreground stroke-foreground size-4 animate-spin"
          />
        </div>
      )}
    </SidebarMenuButton>
  );
}

export function SidebarMenuNavLinkSubButton({
  label,
  icon,
  props: { isPending, isActive },
}: {
  label: string;
  icon?: ReactElement;
  props: NavLinkRenderProps;
}) {
  return (
    <SidebarMenuSubButton
      className={cn(
        "cursor-pointer",
        isActive && "bg-accent/60 outline-ring/40 outline-1",
      )}
    >
      {icon}
      <span>{label}</span>
      {isPending && (
        <div className="flex grow justify-end">
          <Spinner
            aria-label="Loading animation"
            className="dark:stroke-foreground stroke-foreground size-4 animate-spin"
          />
        </div>
      )}
    </SidebarMenuSubButton>
  );
}
