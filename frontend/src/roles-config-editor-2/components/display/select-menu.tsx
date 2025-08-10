import { ChevronDown } from "lucide-react";

export default function SelectMenu() {
  return (
    <div
      className="flex min-h-[44px] w-[400px] cursor-pointer items-center justify-between rounded-[8px] border-[0.8px] bg-[#18181c] p-[8px]"
      role="list"
    >
      <span className="text-sm text-[#a8abb1]">Select a choice</span>
      <ChevronDown className="size-4" aria-hidden="true" />
    </div>
  );
}
