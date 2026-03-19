import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompetitionService, type CompetitionScore, type BatchCompetitionResponse } from "@/app/services/competitionService";

export const useCompetitionScoreQuery = (code: string, enabled = true) => {
  const { getSingleCompetitionScore } = useCompetitionService();
  
  return useQuery<CompetitionScore>({
    queryKey: ["competitionScore", code],
    queryFn: () => getSingleCompetitionScore(code),
    enabled: enabled && !!code,
    staleTime: 5 * 60 * 1000, // 5 minutes - competition scores don't change often
    retry: 2,
  });
};

export const useBatchCompetitionScoresQuery = (codes: string[], enabled = true) => {
  const { getBatchCompetitionScores } = useCompetitionService();
  
  return useQuery<BatchCompetitionResponse>({
    queryKey: ["competitionScores", "batch", codes.sort().join(",")],
    queryFn: () => getBatchCompetitionScores(codes),
    enabled: enabled && codes.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Mutation for prefetching competition scores (useful for background loading)
export const usePrefetchCompetitionScores = () => {
  const { getBatchCompetitionScores } = useCompetitionService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (codes: string[]) => {
      const result = await getBatchCompetitionScores(codes);
      
      // Cache individual scores for later use
      result.scores.forEach(score => {
        queryClient.setQueryData(["competitionScore", score.code], score);
      });
      
      return result;
    },
  });
};