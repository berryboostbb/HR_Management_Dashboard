import { useState, useEffect } from "react";
import { useDebounce } from "../Debounce";
import { getAllAccounts } from "../../api/authServices";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { Icon } from "@iconify/react";

interface CustomSelectProps {
  value?: string | null; // employeeId
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchSelect({
  value,
  onChange,
  placeholder = "Select Employee",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(
    null
  );
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // Fetch employees with debounced search\

  const { data, isFetching } = useQuery<AxiosResponse<any>>({
    queryKey: ["Accounts", debouncedSearch],
    queryFn: () => getAllAccounts(debouncedSearch),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (value && data?.data) {
      const found = data.data.find((emp: any) => emp.employeeId === value);
      if (found) setSelected({ id: found.employeeId, name: found.name });
    }
  }, [value, data]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = (option: any) => {
    setSelected({ id: option.employeeId, name: option.name });
    onChange?.(option.employeeId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="absolute -top-2 left-5 bg-white px-1 text-xs text-[#7D7D7D]">
        {placeholder}
      </label>

      <div
        className="flex items-center h-14 justify-between bg-white px-4 py-2 border-[0.5px] border-[#0755E9] rounded-md cursor-pointer"
        onClick={toggleOpen}
      >
        <span
          className={`text-sm capitalize ${
            selected ? "text-heading" : "text-[#7d7d7d]"
          }`}
        >
          {selected?.name || "Select an employee"}
        </span>

        <Icon
          icon="weui:search-outlined"
          className={`transition-transform duration-200 text-3xl ${
            isOpen ? "text-[#7d7d7d]" : "text-[#0755E9]"
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-[#E5EBF7] border rounded-md shadow-xl z-9999 max-h-60 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 border-b outline-none"
          />
          {isFetching && <p className="px-4 py-2 text-gray-500">Loading...</p>}
          {data?.data?.map((option: any) => (
            <div
              key={option.employeeId}
              className={`px-4 py-2 cursor-pointer hover:bg-white  ${
                selected?.id === option.employeeId ? "bg-white" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
