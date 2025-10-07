import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSavedSchedules } from "../services/savedSchedulesService";
import { toast } from "sonner";
import { scheduleSubjectsType } from "../schedule/providers/subjectsContext";
import type { SavedSchedule } from "../services/savedSchedulesService";

// Normaliza qualquer forma comum para um array
function normalizeSchedules(x: unknown): SavedSchedule[] {
  if (Array.isArray(x)) return x;
  // objetos comuns: {data: [...]}, {items: [...]}, {results: [...]}
  const obj = x as { data?: unknown; items?: unknown; results?: unknown };
  if (Array.isArray(obj?.data)) return obj.data;
  if (Array.isArray(obj?.items)) return obj.items;
  if (Array.isArray(obj?.results)) return obj.results;
  // objeto único -> coloca em array; null/undefined -> []
  if (obj && typeof obj === "object") return [obj as SavedSchedule];
  return [];
}

export const useSavedSchedulesQuery = () => {
  const {
    getSavedSchedules,
    createSavedSchedule,
    updateSavedSchedule,
    deleteSavedSchedule,
  } = useSavedSchedules();
  const queryClient = useQueryClient();

  const savedSchedulesQuery = useQuery<SavedSchedule[]>({
    queryKey: ["savedSchedules"],
    // Garante sempre um array
    queryFn: async () => {
      const raw = await getSavedSchedules();
      return normalizeSchedules(raw);
    },
    initialData: [],         // evita undefined no primeiro render
    select: (data) => data ?? [],
    staleTime: 30_000,       // opcional: menos refetch
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      scheduleSubjects: scheduleSubjectsType[];
    }) =>
      createSavedSchedule({
        title: data.title,
        description: data.description || "",
        items: data.scheduleSubjects.map((subject) => ({
          subjectCode: subject.code,
          classCode: subject.class || "",
          activated: subject.activated ?? true,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Grade salva com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao salvar a grade");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number;
      title: string;
      description?: string;
      scheduleSubjects: scheduleSubjectsType[];
    }) =>
      updateSavedSchedule(data.id, {
        title: data.title,
        description: data.description || "",
        items: data.scheduleSubjects.map((subject) => ({
          subjectCode: subject.code,
          classCode: subject.class || "",
          activated: subject.activated ?? true,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Grade atualizada com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error updating schedule:", error);
      toast.error(error.message || "Falha ao atualizar a grade");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Grade deletada com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error deleting schedule:", error);
      toast.error(error.message || "Falha ao deletar a grade");
    },
  });

  return {
    savedSchedules: savedSchedulesQuery.data ?? [], // sempre array
    isLoading: savedSchedulesQuery.isLoading,
    error: savedSchedulesQuery.error,
    createSchedule: createMutation.mutate,
    updateSchedule: updateMutation.mutate,
    deleteSchedule: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
