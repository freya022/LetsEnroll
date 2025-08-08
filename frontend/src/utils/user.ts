import { UserDTO } from "@/dto/UserDTO.ts";

export function getAvatarUrl({ id, avatarHash }: UserDTO) {
  if (avatarHash) {
    const extension = avatarHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.${extension}`;
  } else {
    return `https://cdn.discordapp.com/avatars/${(BigInt(id) >> BigInt(22)) % BigInt(6)}.png`;
  }
}
