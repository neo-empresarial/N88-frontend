"use client";
import { SubjectsType } from "../types/dataType";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { useSubjects } from "../providers/subjectsContext";

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

import useAxios from "@/app/api/AxiosInstance";

import { lightColors, darkColors } from "../constants/colors";

interface SearchSubjectProps {
  subjects: SubjectsType[];
}

export default function SearchSubject({ subjects }: SearchSubjectProps) {
  const {
    searchedSubjects,
    setSearchedSubjects,
    scheduleSubjects,
    setScheduleSubjects,
    setSelectedSubject,
  } = useSubjects();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { getSubject } = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationLimit, setPaginationLimit] = useState(20); // initial limit

  // filter objects based on user input
  const filteredSubjects = useMemo(() => {
    const filtered_subjects = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Change the name to include the code
    return filtered_subjects.map((subject) => {
      return {
        ...subject,
        name: `${subject.code} - ${subject.name}`,
      };
    });
  }, [subjects, searchTerm]);

  const paginatedSubjects = filteredSubjects.slice(0, paginationLimit);

  const loadMoreItems = () => {
    setPaginationLimit((prevLimit) => prevLimit + 20); // increase the limit by 20
  };

  const checkFreeColor = () => {
    const freelightcolor = lightColors.filter(
      (color) =>
        !searchedSubjects.some(
          (interestsSubject) => interestsSubject.color?.[0] === color
        )
    );

    const freedarkcolor = darkColors.filter(
      (color) =>
        !searchedSubjects.some(
          (interestsSubject) => interestsSubject.color?.[1] === color
        )
    );

    return [freelightcolor[0], freedarkcolor[0]];
  };

  const handleInterrestSubjects = (subject: SubjectsType) => {
    const isAlreadySelected = searchedSubjects.some((interestsSubject) => {
      return interestsSubject.code === subject.code;
    });

    if (isAlreadySelected) {
      setSearchedSubjects(
        searchedSubjects.filter(
          (interestsSubject) => interestsSubject.code !== subject.code
        )
      );
      setScheduleSubjects(
        scheduleSubjects.filter(
          (interestsSubject) => interestsSubject.code !== subject.code
        )
      );
    } else {
      getSubject(subject.idsubject).then((response: SubjectsType) => {
        const dataWithColors = {
          ...response,
          color: checkFreeColor(),
        };
        setSearchedSubjects([...searchedSubjects, dataWithColors]);
        setScheduleSubjects([
          ...scheduleSubjects,
          { code: subject.code, class: "", activated: true },
        ]);
        return setSelectedSubject(dataWithColors);
      });
    }
  };

  const handleOnSelect = (currentSubject: SubjectsType) => {
    setValue(currentSubject.name === value ? "" : currentSubject.name);
    setOpen(false);
    handleInterrestSubjects(currentSubject);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-1/3 justify-between text-slate-400"
          >
            {value
              ? subjects.find((subject) => subject.name === value)?.name
              : "Selecione a matéria..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 ml-10 min-w-[680px]">
          <Command>
            <CommandInput
              placeholder="Selecione uma matéria..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList >
              {filteredSubjects.length === 0 ? (
                <CommandEmpty>Nenhuma matéria foi encontrada.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {paginatedSubjects.map((subject) => (
                    <CommandItem
                      key={subject.name}
                      value={subject.name}
                      onSelect={() => handleOnSelect(subject)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchedSubjects.find(
                            (interestSubject) =>
                              interestSubject.code === subject.code
                          )
                            ? "opacity-100"
                            : "opacity-0"
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
    </div>
  );
}
