import { NavLink, To, useMatch } from "react-router";
import { forwardRef, HTMLAttributes, ReactElement } from "react";
import {
  SidebarMenuButton,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar.tsx";
import Spinner from "@/assets/spinner.svg?react";
import { cn } from "@/lib/utils.ts";

interface NavLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  to: To;
  label: string;
  icon?: ReactElement;
}

const SidebarMenuNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, icon, label, ...props }, ref) => (
    <NavLink
      {...props}
      to={to}
      ref={ref}
      className={({ isPending }) =>
        cn(
          props.className,
          "transition-opacity delay-50 duration-200 ease-in-out",
          isPending && "opacity-25",
        )
      }
    >
      {({ isPending }) => (
        <>
          {icon}
          <span>{label}</span>
          {isPending && (
            <Spinner
              aria-label="Loading animation"
              className="dark:stroke-foreground stroke-foreground ml-auto animate-spin"
            />
          )}
        </>
      )}
    </NavLink>
  ),
);

export function SidebarMenuNavLinkButton({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon?: ReactElement;
}) {
  const match = useMatch(to);

  return (
    <SidebarMenuButton isActive={match !== null} asChild>
      <SidebarMenuNavLink to={to} label={label} icon={icon} />
    </SidebarMenuButton>
  );
}

export function SidebarMenuNavLinkSubButton({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon?: ReactElement;
}) {
  const match = useMatch(to);

  return (
    <SidebarMenuSubButton isActive={match !== null} asChild>
      <SidebarMenuNavLink to={to} label={label} icon={icon} />
    </SidebarMenuSubButton>
  );
}
