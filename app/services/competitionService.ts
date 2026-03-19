import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface CompetitionScore {
  code: string;
  averageOrdersWithoutVacancy: number;
  category: "Baixa" | "Média" | "Alta";
  semesterCount: number;
}

export interface BatchCompetitionResponse {
  scores: CompetitionScore[];
  requestedCodes: string[];
  foundCodes: string[];
  notFoundCodes: string[];
}

class CompetitionService {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async getSingleCompetitionScore(code: string): Promise<CompetitionScore> {
    const response = await fetchWithAuth(`${this.baseUrl}subjects/${code}/competition-score`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch competition score for ${code}: ${response.statusText}`);
    }

    return response.json();
  }

  async getBatchCompetitionScores(codes: string[]): Promise<BatchCompetitionResponse> {
    if (codes.length === 0) {
      return {
        scores: [],
        requestedCodes: [],
        foundCodes: [],
        notFoundCodes: [],
      };
    }

    const codesParam = codes.join(',');
    const response = await fetchWithAuth(`${this.baseUrl}subjects/competition-scores?codes=${codesParam}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch batch competition scores: ${response.statusText}`);
    }

    return response.json();
  }
}

const competitionService = new CompetitionService();

export const useCompetitionService = () => {
  return {
    getSingleCompetitionScore: competitionService.getSingleCompetitionScore.bind(competitionService),
    getBatchCompetitionScores: competitionService.getBatchCompetitionScores.bind(competitionService),
  };
};

export default competitionService;