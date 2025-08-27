"use client";
import { SubjectsType } from "../types/dataType";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  scheduleSubjectsType,
  useSubjects,
} from "../providers/subjectsContext";

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
import { getUniqueColorPair, releaseColorPair } from "../utils/colorUtils";

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
    selectedSubject,
  } = useSubjects();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { getSubject } = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationLimit, setPaginationLimit] = useState(20);

  // filter objects based on user input
  const filteredSubjects = useMemo(() => {
    // Ensure subjects is always an array
    const subjectsArray = subjects || [];

    const filtered_subjects = subjectsArray.filter(
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
    setPaginationLimit((prevLimit) => prevLimit + 20);
  };

  const handleInterrestSubjects = async (subject: SubjectsType) => {
    const isAlreadySelected = searchedSubjects.some(
      (interestsSubject) => interestsSubject.code === subject.code
    );

    if (isAlreadySelected) {
      const subjectToRemove = searchedSubjects.find(
        (s) => s.code === subject.code
      );
      if (subjectToRemove?.color) {
        releaseColorPair(subjectToRemove.color[0], subjectToRemove.color[1]);
      }

      const newSearchedSubjects = searchedSubjects.filter(
        (interestsSubject) => interestsSubject.code !== subject.code
      );
      const newScheduleSubjects = scheduleSubjects.filter(
        (interestsSubject) => interestsSubject.code !== subject.code
      );

      console.log("Removing subject:", {
        code: subject.code,
        newSearchedSubjects,
        newScheduleSubjects,
      });

      setSearchedSubjects(newSearchedSubjects);
      setScheduleSubjects(newScheduleSubjects);
      setSelectedSubject({} as SubjectsType);
      setValue("");
    } else {
      try {
        const response = await getSubject(subject.idsubject);
        const dataWithColors = {
          ...response,
          color: getUniqueColorPair(),
        };

        const newScheduleSubject = {
          code: dataWithColors.code,
          class: dataWithColors.class,
          color: dataWithColors.color,
          activated: true,
        };

        const newSearchedSubjects = [...searchedSubjects, dataWithColors];
        const newScheduleSubjects = [...scheduleSubjects, newScheduleSubject];

        console.log("Adding subject:", {
          code: subject.code,
          newSearchedSubjects,
          newScheduleSubjects,
        });

        setSearchedSubjects(newSearchedSubjects);
        setScheduleSubjects(newScheduleSubjects);
        setSelectedSubject(dataWithColors);
        setValue(subject.name);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }

    }
  };

  const handleOnSelect = (currentSubject: SubjectsType) => {
    handleInterrestSubjects(currentSubject);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchTerm("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[500px] justify-between"
        >
          <div className="truncate">{value || "Selecione uma matéria..."}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput
            placeholder="Procurar matéria..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>Nenhuma matéria encontrada.</CommandEmpty>
            <CommandGroup>
              {paginatedSubjects.map((subject) => (
                <CommandItem
                  key={subject.idsubject}
                  value={subject.name}
                  onSelect={() => handleOnSelect(subject)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      searchedSubjects.some(
                        (interestsSubject) =>
                          interestsSubject.code === subject.code
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {subject.name}
                </CommandItem>
              ))}
              {filteredSubjects.length > paginationLimit && (
                <CommandItem
                  onSelect={loadMoreItems}
                  className="text-center text-muted-foreground"
                >
                  Load more...
                </CommandItem>

              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
