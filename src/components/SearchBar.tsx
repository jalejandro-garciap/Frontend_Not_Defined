import { Input } from "@heroui/react";
import { FC, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  placeholder,
  onSearchChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <Input
      isClearable
      type="search"
      placeholder={placeholder || "Buscar..."}
      startContent={
        <FaSearch className="text-slate-400 pointer-events-none flex-shrink-0" />
      }
      value={searchTerm}
      onChange={handleChange}
      onClear={() => {
        setSearchTerm("");
        onSearchChange("");
      }}
      fullWidth
      variant="bordered"
      size="lg"
      classNames={{
        inputWrapper: [
          "bg-slate-800/50",
          "border-slate-700",
          "group-data-[focus=true]:border-sky-500",
          "dark:group-data-[focus=true]:border-sky-500",
          "!cursor-text",
          "rounded-xl",
          "px-3",
        ],
        input: ["text-slate-200", "placeholder:text-slate-500", "text-sm"],
        clearButton: "text-slate-400 hover:text-slate-200",
      }}
    />
  );
};
