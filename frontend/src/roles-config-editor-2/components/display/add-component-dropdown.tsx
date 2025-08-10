import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

type AddComponentItem = {
  label: string;
  action: () => void;
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
        {items.map(({ label, action }) => (
          <DropdownMenuItem onClick={action} key={label}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
