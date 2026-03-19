'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useSemestersQuery } from '@/app/hooks/useSemesters';
import { CalendarDays } from 'lucide-react';
import { useMemo } from 'react';

interface SemesterSelectorProps {
  selectedSemester: string | null;
  onSemesterChange: (semester: string) => void;
  disabled?: boolean;
}

function formatSemesterDisplay(semester: string): string {
  return semester.replace(/\//g, '.');
}

export default function SemesterSelector({
  selectedSemester,
  onSemesterChange,
  disabled = false,
}: SemesterSelectorProps) {
  const { data: semesters, isLoading, error } = useSemestersQuery();

  // Filter and transform semesters: hide .3 when .2 exists, rename orphaned .3 to .2
  const processedSemesters = useMemo(() => {
    if (!semesters) return [];

    // Group semesters by year
    const semestersByYear = new Map<string, { sem1?: typeof semesters[0], sem2?: typeof semesters[0], sem3?: typeof semesters[0] }>();
    
    semesters.forEach(semester => {
      const parts = semester.semester.split('.');
      const year = parts[0];
      const suffix = parts[1];
      
      if (!semestersByYear.has(year)) {
        semestersByYear.set(year, {});
      }
      
      const yearData = semestersByYear.get(year)!;
      if (suffix === '1') yearData.sem1 = semester;
      else if (suffix === '2') yearData.sem2 = semester;
      else if (suffix === '3') yearData.sem3 = semester;
    });

    // Build final list: .1 + .2 (hiding .3 when .2 exists, renaming orphaned .3 to .2)
    const result: Array<{ id: number; semester: string; displaySemester: string }> = [];
    
    semestersByYear.forEach(({ sem1, sem2, sem3 }, year) => {
      // Always include .1 if it exists
      if (sem1) {
        result.push({
          id: sem1.id,
          semester: sem1.semester,
          displaySemester: sem1.semester
        });
      }
      
      // For .2/.3: if both exist, show only .2; if only .3 exists, show it as .2
      if (sem2) {
        result.push({
          id: sem2.id,
          semester: sem2.semester,
          displaySemester: sem2.semester
        });
      } else if (sem3) {
        // Orphaned .3 - display as .2 but keep original value for backend
        result.push({
          id: sem3.id,
          semester: sem3.semester,
          displaySemester: `${year}.2`
        });
      }
    });

    // Sort by semester descending (newest first)
    return result.sort((a, b) => b.semester.localeCompare(a.semester));
  }, [semesters]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 h-10 px-3 py-2 border border-destructive rounded-md text-sm text-destructive">
          <CalendarDays className="h-4 w-4" />
          Erro ao carregar semestres
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        disabled={disabled}
        value={selectedSemester || ''}
        onValueChange={onSemesterChange}
      >
        <SelectTrigger id="semester-select" className="w-full">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Selecione um semestre" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {processedSemesters.map((semester) => (
            <SelectItem key={semester.id} value={semester.semester}>
              {formatSemesterDisplay(semester.displaySemester)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}