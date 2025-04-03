import { Component } from "@/dto/RolesConfigDTO.ts";
import { useParams, useRouteLoaderData } from "react-router";
import { GuildDTO } from "@/dto/GuildDTO.ts";

export function getComponentCount(component: Component | Component[]): number {
  if (component instanceof Array) {
    return component.reduce(
      (count, nestedComponent) => count + getComponentCount(nestedComponent),
      0,
    );
  }

  switch (component.type) {
    case "row":
      return getComponentCount(component.components);
    case "button":
      return 1;
    case "string_select_menu":
      return 1;
  }
}

export function getRoleCount(component: Component | Component[]): number {
  if (component instanceof Array) {
    return component.reduce(
      (count, nestedComponent) => count + getRoleCount(nestedComponent),
      0,
    );
  }

  switch (component.type) {
    case "row":
      return getRoleCount(component.components);
    case "button":
      return 1;
    case "string_select_menu":
      return component.choices.length;
  }
}

export function useSelectedGuild() {
  const { guildId } = useParams<{ guildId: string }>();
  const { managedGuilds } = useRouteLoaderData<{ managedGuilds: GuildDTO[] }>(
    "dashboard",
  )!;
  return managedGuilds.find((g) => g.id === guildId!)!;
}