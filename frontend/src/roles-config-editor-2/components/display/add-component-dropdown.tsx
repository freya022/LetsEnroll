import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { MouseEvent } from "react";

type AddComponentItem = {
  label: string;
  action: (event: MouseEvent) => void;
};

export default function AddComponentDropdown({
  label,
  items,
}: {
  label: string;
  items: AddComponentItem[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 max-w-max cursor-pointer items-center justify-center rounded-[8px] border-[2px] border-dashed border-gray-600 px-[11px] py-[3px]">
          <span className="text-sm">{label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-52">
        {items.map((item) => (
          <ComponentDropdownMenuItem item={item} key={label} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ComponentDropdownMenuItem({
  item: { label, action },
}: {
  item: AddComponentItem;
}) {
  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    action(event);
  }

  return (
    <DropdownMenuItem onClick={handleClick} key={label}>
      {label}
    </DropdownMenuItem>
  );
}
