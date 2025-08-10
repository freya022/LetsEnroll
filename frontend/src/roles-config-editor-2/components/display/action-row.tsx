import { ReactNode } from "react";

export default function ActionRow({ children }: { children: ReactNode }) {
  return <li className="flex flex-wrap gap-x-2 gap-y-1">{children}</li>;
}
