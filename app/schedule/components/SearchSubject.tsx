"use client";
import { SubjectsType } from "../types/dataType";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchSubjectProps {
  subjects: SubjectsType[];
  isLoading: boolean;
}

export default function SearchSubject({
  subjects,
  isLoading,
}: SearchSubjectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [paginationLimit, setPaginationLimit] = React.useState(20); // initial limit

  // filter objects based on user input
  const filteredSubjects = React.useMemo(() => {
    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

  const paginatedSubjects = filteredSubjects.slice(0, paginationLimit);

  const loadMoreItems = () => {
    setPaginationLimit((prevLimit) => prevLimit + 20); // increase the limit by 20
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between text-slate-400"
        >
          {value
            ? subjects.find((subject) => subject.name === value)?.name
            : "Selecione a matéria..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0">
        <Command>
          <CommandInput
            placeholder="Selecione a matéria..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {filteredSubjects.length === 0 ? (
              <CommandEmpty>Nenheuma matéria foi encontrada.</CommandEmpty>
            ) : (
              <CommandGroup>
                {paginatedSubjects.map((subject) => (
                  <CommandItem
                    key={subject.name}
                    value={subject.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === subject.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {subject.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {paginationLimit < filteredSubjects.length && (
              <div className="p-2 text-center flex">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={loadMoreItems}
                >
                  Load More
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
