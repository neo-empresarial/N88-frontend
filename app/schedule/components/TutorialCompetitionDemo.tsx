"use client";

import { useEffect, useState, useRef } from "react";
import useAxios from "@/app/api/AxiosInstance";
import { useSubjects } from "../providers/subjectsContext";
import { SubjectsProvider } from "../providers/subjectsContext";
import SubjectsTable from "./SubjectsTable";
import SelectedSubject from "./SelectedSubject";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUniqueColorPair, releaseColorPair } from "../utils/colorUtils";
import { useCompetitionService } from "@/app/services/competitionService";

/**
 * Inner component that uses the SubjectsContext
 * This must be wrapped by SubjectsProvider
 */
function TutorialCompetitionDemoInner() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);
  const assignedColorsRef = useRef<Array<[string, string]>>([]);
  const axiosInstance = useAxios();
  const { setSearchedSubjects, setScheduleSubjects } = useSubjects();
  const { getSingleCompetitionScore } = useCompetitionService();

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    const fetchDemoSubjects = async () => {
      try {
        setIsLoading(true);
        const codes = ["MTM3120", "EFC5806", "INE5642"];
        
        const basicData = await axiosInstance.getSubjectsByCodes(codes);

        if (Array.isArray(basicData) && basicData.length > 0) {
          const uniqueData = Array.from(
            new Map(basicData.map((s) => [s.code, s])).values()
          );

          const enrichmentPromises = uniqueData.map((subject) =>
            Promise.allSettled([
              axiosInstance.getSubject(subject.idsubject),
              getSingleCompetitionScore(subject.code),
            ])
          );

          const settledResults = await Promise.all(enrichmentPromises);

          const enrichedData = settledResults.map((result) => {
            if (result[0].status !== "fulfilled") {
              return undefined;
            }

            const fullSubjectData = result[0].value;
            const colorPair = getUniqueColorPair();
            assignedColorsRef.current.push(colorPair);

            const enrichedSubject = {
              ...fullSubjectData,
              color: colorPair,
            };

            if (result[1].status === "fulfilled") {
              enrichedSubject.competition = result[1].value;
            } else {
              console.warn(`Failed to fetch competition score for ${fullSubjectData.code}`);
            }

            return enrichedSubject;
          });

          const validData = enrichedData.filter((s) => s !== undefined);

          const scheduleSubjectsData = validData.map((subject) => ({
            code: subject.code,
            class: subject.classes?.[0]?.classcode || "",
            activated: true,
          }));

          setSearchedSubjects(validData);
          setScheduleSubjects(scheduleSubjectsData);
          setError(null);
        } else {
          setError("Nenhuma matéria encontrada para demonstração");
        }
      } catch (err: Error | unknown) {
        console.error("Failed to fetch tutorial demo subjects:", err);
        setError("Não foi possível carregar as matérias de demonstração");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      assignedColorsRef.current.forEach(([light, dark]) => {
        releaseColorPair(light, dark);
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Carregando demonstração...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Table section - 75% width, centered */}
      <div className="flex justify-center">
        <div className="w-3/4">
          <div className="bg-muted/20 p-4 rounded-lg border">
            <SubjectsTable />
          </div>
        </div>
      </div>

      {/* Available classes section */}
      <div className="flex justify-center">
        <div className="w-3/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Turmas Disponíveis</CardTitle>
              <CardDescription>
                Selecione uma matéria acima para ver as turmas disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SelectedSubject />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tip */}
      <div className="flex justify-center">
        <div className="w-3/4">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Dica:</strong> Esta é a tabela real que você usará no cronograma! Clique em uma matéria para ver as turmas disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Outer component that provides the SubjectsProvider context
 */
export default function TutorialCompetitionDemo() {
  return (
    <SubjectsProvider>
      <TutorialCompetitionDemoInner />
    </SubjectsProvider>
  );
}
