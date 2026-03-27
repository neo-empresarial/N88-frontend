'use client';

import { useQuery } from '@tanstack/react-query';
import { campusesService } from '@/app/services/campusesService';

export function useCampusesQuery() {
  return useQuery({
    queryKey: ['campuses'],
    queryFn: () => campusesService.getCampuses(),
    staleTime: 10 * 60 * 1000, // 10 minutes (mais longo que semesters - campus muda raramente)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
