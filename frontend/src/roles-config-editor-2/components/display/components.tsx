import { ReactNode } from "react";

export default function Components({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-y-1">{children}</ul>;
}
