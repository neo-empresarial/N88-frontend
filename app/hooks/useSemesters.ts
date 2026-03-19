'use client';

import { useQuery } from '@tanstack/react-query';
import { semestersService } from '@/app/services/semestersService';

export function useSemestersQuery() {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: () => semestersService.getSemesters(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}