import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useSharedSchedules,
  ShareScheduleDto,
  AcceptSharedScheduleDto,
} from "../services/sharedSchedulesService";
import { toast } from "sonner";

export const useSharedSchedulesQuery = () => {
  const {
    shareSchedule,
    getReceivedSharedSchedules,
    getSentSharedSchedules,
    acceptSharedSchedule,
    declineSharedSchedule,
  } = useSharedSchedules();
  const queryClient = useQueryClient();

  const receivedSharedSchedulesQuery = useQuery({
    queryKey: ["receivedSharedSchedules"],
    queryFn: getReceivedSharedSchedules,
  });

  const sentSharedSchedulesQuery = useQuery({
    queryKey: ["sentSharedSchedules"],
    queryFn: getSentSharedSchedules,
  });

  const shareMutation = useMutation({
    mutationFn: (data: ShareScheduleDto) => {
      return shareSchedule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentSharedSchedules"] });
      queryClient.invalidateQueries({ queryKey: ["receivedSharedSchedules"] });
      toast.success("Schedule shared successfully");
    },
    onError: (error: Error) => {
      console.error("Error sharing schedule:", error);
      toast.error(error.message || "Failed to share schedule");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (data: AcceptSharedScheduleDto) => {
      return acceptSharedSchedule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedSharedSchedules"] });
      queryClient.invalidateQueries({ queryKey: ["savedSchedules"] });
      toast.success("Schedule accepted successfully");
    },
    onError: (error: Error) => {
      console.error("Error accepting schedule:", error);
      toast.error(error.message || "Failed to accept schedule");
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineSharedSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivedSharedSchedules"] });
      toast.success("Schedule declined successfully");
    },
    onError: (error: Error) => {
      console.error("Error declining schedule:", error);
      toast.error(error.message || "Failed to decline schedule");
    },
  });

  return {
    receivedSharedSchedules: receivedSharedSchedulesQuery.data,
    sentSharedSchedules: sentSharedSchedulesQuery.data,
    isLoadingReceived: receivedSharedSchedulesQuery.isLoading,
    isLoadingSent: sentSharedSchedulesQuery.isLoading,
    errorReceived: receivedSharedSchedulesQuery.error,
    errorSent: sentSharedSchedulesQuery.error,
    shareSchedule: shareMutation.mutate,
    acceptSharedSchedule: acceptMutation.mutate,
    declineSharedSchedule: declineMutation.mutate,
    isSharing: shareMutation.isPending,
    isAccepting: acceptMutation.isPending,
    isDeclining: declineMutation.isPending,
  };
};
