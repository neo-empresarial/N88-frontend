"use client";
import { SubjectsType } from "../types/dataType";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { useSubjects } from "../providers/subjectsContext";
import { useCompetitionService } from "@/app/services/competitionService";

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

const PAGE_SIZE = 20;

export default function SearchSubject({ subjects }: SearchSubjectProps) {
  const {
    searchedSubjects,
    setSearchedSubjects,
    scheduleSubjects,
    setScheduleSubjects,
    setSelectedSubject,
    selectedSemester,
    selectedCampus,
  } = useSubjects();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { getSubject } = useAxios();
  const { getSingleCompetitionScore } = useCompetitionService();
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationLimit, setPaginationLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref to the Command wrapper div — used to locate the [cmdk-list] element
  const commandRef = useRef<HTMLDivElement>(null);

  const filteredSubjects = useMemo(() => {
    const subjectsArray = subjects || [];

    // Campus filtering is handled by the API, not here
    let semesterFilteredSubjects = subjectsArray;
    if (selectedSemester) {
      const parts = selectedSemester.split('.');
      const suffix = parts[1];
      if (suffix === '2' || suffix === '3') {
        const year = parts[0];
        const sem2 = `${year}.2`;
        const sem3 = `${year}.3`;
        const candidates = subjectsArray.filter(
          (subject) =>
            subject.semester?.semester === sem2 ||
            subject.semester?.semester === sem3
        );
        const byCode = new Map<string, SubjectsType>();
        for (const subj of candidates) {
          const existing = byCode.get(subj.code);
          if (!existing) {
            byCode.set(subj.code, subj);
            continue;
          }
          const existingSem = existing.semester?.semester;
          const currentSem = subj.semester?.semester;
          if (existingSem?.endsWith('.2') && currentSem?.endsWith('.3')) {
            byCode.set(subj.code, subj);
          }
        }
        semesterFilteredSubjects = Array.from(byCode.values());
      } else {
        semesterFilteredSubjects = subjectsArray.filter(
          (subject) => subject.semester?.semester === selectedSemester
        );
      }
    }

    const filtered_subjects = semesterFilteredSubjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered_subjects.map((subject) => ({
      ...subject,
      name: `${subject.code} - ${subject.name}`,
    }));
  }, [subjects, searchTerm, selectedSemester]);

  // Reset pagination whenever the search term changes
  useEffect(() => {
    setPaginationLimit(PAGE_SIZE);
  }, [searchTerm]);

  const paginatedSubjects = filteredSubjects.slice(0, paginationLimit);
  const hasMore = filteredSubjects.length > paginationLimit;

  const loadMoreItems = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPaginationLimit((prev) => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 150);
  }, [hasMore, isLoadingMore]);

  // Attach a scroll listener to CommandList's internal scroll container ([cmdk-list]).
  // IntersectionObserver won't work here because CommandList clips its children
  // via overflow:auto — the sentinel would never intersect the browser viewport.
  useEffect(() => {
    if (!open) return;

    // Give the DOM a moment to render the popover before querying
    const timeoutId = setTimeout(() => {
      const listEl = commandRef.current?.querySelector<HTMLElement>(
        "[cmdk-list]"
      );
      if (!listEl) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = listEl;
        // Trigger when within 60px of the bottom
        if (scrollHeight - scrollTop - clientHeight < 60) {
          loadMoreItems();
        }
      };

      listEl.addEventListener("scroll", handleScroll, { passive: true });
      return () => listEl.removeEventListener("scroll", handleScroll);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [open, loadMoreItems]);

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

      setSearchedSubjects(
        searchedSubjects.filter((s) => s.code !== subject.code)
      );
      setScheduleSubjects(
        scheduleSubjects.filter((s) => s.code !== subject.code)
      );
      setSelectedSubject({} as SubjectsType);
      setValue("");
    } else {
      try {
        // Fetch subject data and competition score in parallel
        const [response, competitionScore] = await Promise.allSettled([
          getSubject(subject.idsubject, selectedCampus || undefined),
          getSingleCompetitionScore(subject.code)
        ]);

        // Handle subject data
        if (response.status === 'rejected') {
          throw new Error('Failed to fetch subject data');
        }

        const dataWithColors = {
          ...response.value,
          color: getUniqueColorPair(),
        };

        // Handle competition score (optional - don't fail if it fails)
        if (competitionScore.status === 'fulfilled') {
          dataWithColors.competition = competitionScore.value;
        } else {
          console.warn(`Failed to fetch competition score for ${subject.code}:`, competitionScore.reason);
        }

        const newScheduleSubject = {
          code: dataWithColors.code,
          class: dataWithColors.class,
          color: dataWithColors.color,
          activated: true,
        };

        setSearchedSubjects([...searchedSubjects, dataWithColors]);
        setScheduleSubjects([...scheduleSubjects, newScheduleSubject]);
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
    setValue("");
    setSearchTerm("");
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
        <Command ref={commandRef}>
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
                        (s) => s.code === subject.code
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {subject.name}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Loading indicator — rendered outside CommandGroup so it's always visible */}
            {isLoadingMore && (
              <div className="py-2 flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
