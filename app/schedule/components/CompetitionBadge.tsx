"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface CompetitionBadgeProps {
  score?: {
    averageOrdersWithoutVacancy: number;
    category: "Baixa" | "Média" | "Alta";
    semesterCount: number;
  };
  isLoading?: boolean;
  error?: Error | null;
}

const getCategoryColor = (category: "Baixa" | "Média" | "Alta") => {
  switch (category) {
    case "Baixa":
      return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800";
    case "Média":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-800";
    case "Alta":
      return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700 dark:hover:bg-red-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700";
  }
};

const getClassificationLimits = () => {
  return "Baixa: 0-15 | Média: 15-30 | Alta: 30+";
};

export default function CompetitionBadge({ score, isLoading, error }: CompetitionBadgeProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  if (error || !score) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs h-6 px-2 cursor-help"
          >
            —
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Concorrência indisponível</p>
          {error && <p className="text-xs text-muted-foreground">{error.message}</p>}
        </TooltipContent>
      </Tooltip>
    );
  }

  const tooltipContent = (
    <div className="space-y-1">
      <p className="font-semibold text-sm">
        Pedidos sem vaga: {Math.round(score.averageOrdersWithoutVacancy)}
      </p>
      <p className="text-xs text-muted-foreground">
        {getClassificationLimits()}
      </p>
      <p className="text-xs text-muted-foreground">
        Baseado em {score.semesterCount} semestre{score.semesterCount !== 1 ? 's' : ''}
      </p>
    </div>
  );

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs h-6 px-2 cursor-help border ${getCategoryColor(score.category)}`}
        >
          {score.category}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}