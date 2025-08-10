import { ReactNode } from "react";

export default function Property({ children }: { children: ReactNode }) {
  return <div className="stretch grid gap-2">{children}</div>;
}
