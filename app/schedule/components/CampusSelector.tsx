'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampusesQuery } from '@/app/hooks/useCampuses';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface CampusSelectorProps {
  selectedCampus: string | null;
  onCampusChange: (campusId: string) => void;
  disabled?: boolean;
}

export default function CampusSelector({
  selectedCampus,
  onCampusChange,
  disabled = false,
}: CampusSelectorProps) {
  const { data: campuses, isLoading, error } = useCampusesQuery();

  const sortedCampuses = useMemo(() => {
    if (!campuses) return [];
    
    return [...campuses].sort((a, b) => {
      if (a.name === 'Florianópolis') return -1;
      if (b.name === 'Florianópolis') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [campuses]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-[180px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 h-10 px-3 py-2 border border-destructive rounded-md text-sm text-destructive w-[180px]">
          <MapPin className="h-4 w-4" />
          Erro ao carregar campi
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        disabled={disabled}
        value={selectedCampus || ''}
        onValueChange={onCampusChange}
      >
        <SelectTrigger id="campus-select" className="w-[180px]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Selecione o campus" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {sortedCampuses.map((campus) => (
            <SelectItem key={campus.id} value={String(campus.id)}>
              {campus.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
