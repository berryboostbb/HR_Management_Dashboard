import { Icon } from "@iconify/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchById({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-[#131313] text-sm font-medium md:w-15 w-20 ">
        Emp ID:
      </p>

      <div className="relative">
        <input
          placeholder="Search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border pl-9 w-40 lg:w-45 border-[#0755E9] h-10 pr-4 rounded-lg focus:outline-none"
        />

        <div className="absolute inset-y-0 left-0 flex gap-3 items-center pl-3 pointer-events-none">
          <Icon icon="circum:search" color="#7d7d7d" />
        </div>
      </div>
    </div>
  );
}
