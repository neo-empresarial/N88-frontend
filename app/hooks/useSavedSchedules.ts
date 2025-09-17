import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSavedSchedules } from "../services/savedSchedulesService";
import { toast } from "sonner";
import { scheduleSubjectsType } from "../schedule/providers/subjectsContext";

export const useSavedSchedulesQuery = () => {
  const {
    getSavedSchedules,
    createSavedSchedule,
    updateSavedSchedule,
    deleteSavedSchedule,
  } = useSavedSchedules();
  const queryClient = useQueryClient();

  const savedSchedulesQuery = useQuery({
    queryKey: ["savedSchedules"],
    queryFn: getSavedSchedules,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      scheduleSubjects: scheduleSubjectsType[];
    }) => {
      console.log("Creating schedule with data:", data);
      return createSavedSchedule({
        title: data.title,
        description: data.description || '',
        items: data.scheduleSubjects.map((subject) => ({
          subjectCode: subject.code,
          classCode: subject.class || "",
          activated: subject.activated ?? true,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
    },
    onError: (error: Error) => {
      console.error("Error saving schedule:", error);
      toast.error(error.message || "Failed to save schedule");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number;
      title: string;
      description?: string;
      scheduleSubjects: scheduleSubjectsType[];
    }) => {
      console.log("Updating schedule with data:", data);
      return updateSavedSchedule(data.id, {
        title: data.title,
        description: data.description || '',
        items: data.scheduleSubjects.map((subject) => ({
          subjectCode: subject.code,
          classCode: subject.class || "",
          activated: subject.activated ?? true,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Grade atualizada com sucesso");
    },
    onError: (error: Error) => {
      console.error("Error updating schedule:", error);
      toast.error(error.message || "Failed to update schedule");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Schedule deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting schedule:", error);
      toast.error(error.message || "Failed to delete schedule");
    },
  });

  console.log(savedSchedulesQuery.data)

  return {
    savedSchedules: savedSchedulesQuery.data,
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
