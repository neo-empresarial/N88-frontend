"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Users,
  Save,
  Search,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Play,
  Target,
  Award,
  Calculator,
  Zap,
  Copy,
  Home,
  Eraser,
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SearchSubject from "@/app/schedule/components/SearchSubject";
import CompetitionBadge from "@/app/schedule/components/CompetitionBadge";
import TutorialCompetitionDemo from "@/app/schedule/components/TutorialCompetitionDemo";
import { SubjectsProvider } from "@/app/schedule/providers/subjectsContext";
import { SubjectsType } from "@/app/schedule/types/dataType";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import useAxios from "@/app/api/AxiosInstance";
import { useEffect } from "react";
import { Loader2, MapPin, CalendarDays, FileText, FolderPlus } from "lucide-react";
import { useCampusesQuery } from "@/app/hooks/useCampuses";
import { useSemestersQuery } from "@/app/hooks/useSemesters";

const tutorialSubjects: SubjectsType[] = [
  {
    idsubject: 4,
    code: "DAS5102",
    name: "Fundamentos da Estrutura da Informação",
    classes: [
      {
        idclass: 4,
        classcode: "02220A",
        totalvacancies: 28,
        freevacancies: 20,
        schedules: [
          {
            idschedule: 4,
            weekday: "Terça",
            starttime: "14:20",
            classesnumber: 2,
            building: "EEL",
            room: "001",
          },
          {
            idschedule: 5,
            weekday: "Quinta",
            starttime: "14:20",
            classesnumber: 2,
            building: "EEL",
            room: "001",
          },
        ],
        professors: [{ idprofessor: 4, name: "Prof. Marina Silva" }],
      },
      {
        idclass: 5,
        classcode: "02220B",
        totalvacancies: 28,
        freevacancies: 24,
        schedules: [
          {
            idschedule: 6,
            weekday: "Terça",
            starttime: "16:20",
            classesnumber: 2,
            building: "EEL",
            room: "002",
          },
          {
            idschedule: 7,
            weekday: "Quinta",
            starttime: "16:20",
            classesnumber: 2,
            building: "EEL",
            room: "002",
          },
        ],
        professors: [{ idprofessor: 5, name: "Prof. João Santos" }],
      },
    ],
    competition: {
      averageOrdersWithoutVacancy: 8,
      category: "Baixa",
      semesterCount: 5,
    },
  },
  {
    idsubject: 5,
    code: "EEL5105",
    name: "Circuitos e Técnicas Digitais",
    classes: [
      {
        idclass: 6,
        classcode: "01208A",
        totalvacancies: 28,
        freevacancies: 31, // More than capacity due to overenrollment
        schedules: [
          {
            idschedule: 8,
            weekday: "Segunda",
            starttime: "14:20",
            classesnumber: 2,
            building: "EEL",
            room: "101",
          },
          {
            idschedule: 9,
            weekday: "Quarta",
            starttime: "14:20",
            classesnumber: 2,
            building: "EEL",
            room: "101",
          },
        ],
        professors: [{ idprofessor: 6, name: "Prof. Carlos Alberto" }],
      },
      {
        idclass: 7,
        classcode: "01208D",
        totalvacancies: 28,
        freevacancies: 22,
        schedules: [
          {
            idschedule: 10,
            weekday: "Terça",
            starttime: "10:10",
            classesnumber: 2,
            building: "EEL",
            room: "102",
          },
          {
            idschedule: 11,
            weekday: "Quinta",
            starttime: "10:10",
            classesnumber: 2,
            building: "EEL",
            room: "102",
          },
        ],
        professors: [{ idprofessor: 7, name: "Prof. Ana Lucia" }],
      },
    ],
    competition: {
      averageOrdersWithoutVacancy: 25.5,
      category: "Média",
      semesterCount: 4,
    },
  },
  {
    idsubject: 6,
    code: "FSC5002",
    name: "Física II",
    classes: [
      {
        idclass: 8,
        classcode: "02201A",
        totalvacancies: 51,
        freevacancies: 48,
        schedules: [
          {
            idschedule: 12,
            weekday: "Quarta",
            starttime: "10:10",
            classesnumber: 3,
            building: "FSC",
            room: "201",
          },
          {
            idschedule: 13,
            weekday: "Sexta",
            starttime: "10:10",
            classesnumber: 3,
            building: "FSC",
            room: "201",
          },
        ],
        professors: [{ idprofessor: 8, name: "Prof. Roberto Lima" }],
      },
    ],
    competition: {
      averageOrdersWithoutVacancy: 12.3,
      category: "Baixa",
      semesterCount: 6,
    },
  },
  {
    idsubject: 7,
    code: "MTM3120",
    name: "Cálculo 2",
    classes: [
      {
        idclass: 9,
        classcode: "02201",
        totalvacancies: 35,
        freevacancies: 35,
        schedules: [
          {
            idschedule: 14,
            weekday: "Segunda",
            starttime: "10:10",
            classesnumber: 3,
            building: "MTM",
            room: "101",
          },
          {
            idschedule: 15,
            weekday: "Quarta",
            starttime: "10:10",
            classesnumber: 3,
            building: "MTM",
            room: "101",
          },
        ],
        professors: [{ idprofessor: 9, name: "Prof. Maria Helena" }],
      },
    ],
    competition: {
      averageOrdersWithoutVacancy: 18.7,
      category: "Média",
      semesterCount: 5,
    },
  },
];

// Component to provide real subjects for search functionality
function TutorialSearchSubject() {
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAllSubjects } = useAxios();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const data = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects(tutorialSubjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return <SearchSubject subjects={subjects} />;
}

function TutorialCampusSelector({ 
  selectedCampus, 
  onCampusChange 
}: { 
  selectedCampus: string; 
  onCampusChange: (campusId: string) => void; 
}) {
  const { data: campuses, isLoading } = useCampusesQuery();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Carregando..." />
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  const sortedCampuses = campuses ? [...campuses].sort((a, b) => {
    if (a.name === 'Florianópolis') return -1;
    if (b.name === 'Florianópolis') return 1;
    return a.name.localeCompare(b.name);
  }) : [];

  return (
    <Select value={selectedCampus} onValueChange={onCampusChange}>
      <SelectTrigger className="w-[150px]">
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
  );
}

function TutorialSemesterSelector({
  selectedSemester,
  onSemesterChange
}: {
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
}) {
  const { data: semesters, isLoading } = useSemestersQuery();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[100px]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Carregando..." />
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  const processedSemesters = semesters ? semesters.map(s => ({
    ...s,
    displaySemester: s.semester.replace(/\//g, '.')
  })).sort((a, b) => b.semester.localeCompare(a.semester)) : [];

  return (
    <Select value={selectedSemester} onValueChange={onSemesterChange}>
      <SelectTrigger className="w-[120px]">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Selecione" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {processedSemesters.map((semester) => (
          <SelectItem key={semester.id} value={semester.semester}>
            {semester.displaySemester}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [selectedCampus, setSelectedCampus] = useState<string>("1");
  const [selectedSemester, setSelectedSemester] = useState<string>("2026/1");
  const [activePlan, setActivePlan] = useState<number>(1);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);
  
  const [plansInitialized, setPlansInitialized] = useState<Set<number>>(new Set([1]));
  const [showCopyPlanDialog, setShowCopyPlanDialog] = useState<boolean>(false);
  const [targetPlan, setTargetPlan] = useState<number | null>(null);

  const handlePlanClick = (planNumber: number) => {
    if (plansInitialized.has(planNumber)) {
      setActivePlan(planNumber);
    } else {
      setTargetPlan(planNumber);
      setShowCopyPlanDialog(true);
    }
  };

  const handleCopyFromPlan = (sourcePlan: number) => {
    if (targetPlan) {
      setPlansInitialized(prev => new Set([...Array.from(prev), targetPlan]));
      setActivePlan(targetPlan);
      setShowCopyPlanDialog(false);
      setTargetPlan(null);
    }
  };

  const handleStartEmpty = () => {
    if (targetPlan) {
      setPlansInitialized(prev => new Set([...Array.from(prev), targetPlan]));
      setActivePlan(targetPlan);
      setShowCopyPlanDialog(false);
      setTargetPlan(null);
    }
  };

  const plan2HasSubjects = activePlan === 2 || plansInitialized.has(2);
  const isPlan3Disabled = !plan2HasSubjects && activePlan !== 3;

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const tutorialSteps = [
    {
      id: "intro",
      title: "Bem-vindo ao Gradi",
      description: "Sua nova forma de planejar a vida acadêmica",
      icon: <BookOpen className="h-8 w-8" />,
    },
    {
      id: "getting-started",
      title: "Navegação e Interface",
      description: "Conhecendo a interface de três painéis",
      icon: <Play className="h-8 w-8" />,
    },
    {
      id: "building-schedule",
      title: "Sistema de Três Planos",
      description: "Criando e gerenciando múltiplos cenários",
      icon: <Copy className="h-8 w-8" />,
    },
    {
      id: "competition-analysis",
      title: "Análise de Concorrência",
      description: "Interpretando dados de demanda histórica",
      icon: <BarChart3 className="h-8 w-8" />,
    },
    {
      id: "auto-save-features",
      title: "Auto-save e Persistência",
      description: "Salvamento automático e sincronização",
      icon: <Zap className="h-8 w-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <motion.div 
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6">
              Tutorial Completo
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Aprenda a usar o{" "}
              <span className="text-primary">Gradi</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Descubra como aproveitar ao máximo todas as funcionalidades da plataforma 
              de planejamento acadêmico mais intuitiva para estudantes da UFSC.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" onClick={() => setCurrentStep(1)}>
                Começar Tutorial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/schedule">
                <Button variant="outline" size="lg">
                  Ir para o Gradi
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Navigation */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {tutorialSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentStep === index
                      ? "bg-primary text-primary-foreground"
                      : completedSteps.includes(index)
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "hover:bg-muted"
                  }`}
                >
                   {completedSteps.includes(index) ? (
                     <CheckCircle className="h-4 w-4" />
                   ) : index === 0 ? (
                     <Home className="h-4 w-4" />
                   ) : (
                     <span className="text-xs font-medium">{index}</span>
                   )}
                  <span className="hidden sm:inline text-sm font-medium">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
            <Badge variant="secondary" className="ml-auto">
              {completedSteps.length} de {tutorialSteps.length} concluídos
            </Badge>
          </div>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Step 0: Introduction */}
        {currentStep === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            <div className="text-center">
              <BookOpen className="mx-auto h-16 w-16 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Bem-vindo ao Tutorial do Gradi
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                O Gradi é sua ferramenta completa para planejamento acadêmico. 
                Vamos te ensinar tudo que você precisa saber para usar a plataforma como um expert!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorialSteps.slice(1).map((step, index) => (
                <Card key={step.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {step.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Etapa {index + 1}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => setCurrentStep(1)}>
                Vamos começar!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 1: Getting Started */}
        {currentStep === 1 && (
          <motion.div
            key="getting-started"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <Play className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Navegação e Interface</h2>
              <p className="text-muted-foreground">
                Conheça a interface principal e aprenda a navegar entre os elementos
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Layout de Três Painéis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    A interface principal é dividida em três áreas que você pode redimensionar arrastando as bordas.
                  </p>
                  <SubjectsProvider>
                    <div className="border rounded-lg overflow-hidden">
                      <ResizablePanelGroup direction="horizontal" className="min-h-[300px]">
                        <ResizablePanel defaultSize={50} minSize={30}>
                          <ResizablePanelGroup direction="vertical">
                            <ResizablePanel defaultSize={50}>
                              <div className="flex h-full flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-950/20">
                                <Search className="h-8 w-8 text-blue-600 mb-2" />
                                <span className="font-semibold text-blue-700 dark:text-blue-300 text-center">Lista de Matérias</span>
                                <p className="text-xs text-center text-blue-600/80 mt-1">
                                  Tabela com suas matérias selecionadas
                                </p>
                              </div>
                            </ResizablePanel>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={50}>
                              <div className="flex h-full flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-950/20">
                                <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                                <span className="font-semibold text-purple-700 dark:text-purple-300 text-center">Detalhes da Matéria</span>
                                <p className="text-xs text-center text-purple-600/80 mt-1">
                                  Turmas, horários e professores
                                </p>
                              </div>
                            </ResizablePanel>
                          </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                          <div className="flex h-full items-center justify-center p-4 bg-green-50 dark:bg-green-950/20">
                            <div className="text-center">
                              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                              <span className="font-semibold text-green-700 dark:text-green-300">Grade Semanal</span>
                              <p className="text-xs text-green-600/80 mt-1">
                                Visualização por dias da semana
                              </p>
                            </div>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  </SubjectsProvider>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-primary" />
                    <span>Barra de Busca Inteligente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Use a barra de busca para encontrar matérias por código ou nome. Ela filtra automaticamente conforme você digita.
                  </p>
                  <div className="space-y-3">
                   <div className="bg-muted/50 p-3 rounded-lg">
                     <SubjectsProvider>
                       <TutorialSearchSubject />
                     </SubjectsProvider>
                   </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Exemplos de busca:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• &quot;INE5408&quot; - busca por código</li>
                        <li>• &quot;Estruturas&quot; - busca por nome</li>
                        <li>• &quot;Cálculo&quot; - busca parcial</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Controles Principais da Interface</span>
                  </CardTitle>
                  <CardDescription>
                    Conheça todos os botões e controles da barra superior do cronograma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Ações do Cronograma:</h5>
                      <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Eraser className="h-4 w-4" />
                          Limpar
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Save className="h-4 w-4" />
                          Salvar
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FolderPlus className="h-4 w-4" />
                          Nova Grade
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Ações principais:</strong> Limpar remove todas as matérias do plano atual. 
                        Salvar guarda o cronograma na sua conta. Nova Grade cria um cronograma vazio. 
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Filtros de Busca:</h5>
                      <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <TutorialCampusSelector 
                            selectedCampus={selectedCampus}
                            onCampusChange={setSelectedCampus}
                          />
                          <span className="text-xs text-muted-foreground">Campus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TutorialSemesterSelector
                            selectedSemester={selectedSemester}
                            onSemesterChange={setSelectedSemester}
                          />
                          <span className="text-xs text-muted-foreground">Semestre</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Seleção de Campus e Semestre:</strong> Estes controles filtram quais matérias aparecem na busca. 
                        Escolha seu campus e semestre desejado para ver apenas as matérias disponíveis nessa combinação.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Sistema de Três Planos:</h5>
                      <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border">
                        <Button 
                          variant={activePlan === 1 ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setActivePlan(1)}
                        >
                          Plano 1
                        </Button>
                        <Button 
                          variant={activePlan === 2 ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setActivePlan(2)}
                        >
                          Plano 2
                        </Button>
                        <Button 
                          variant={activePlan === 3 ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setActivePlan(3)}
                        >
                          Plano 3
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">← Alternar entre cenários</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Sistema de Planos:</strong> Você pode criar até três cenários diferentes de cronograma. 
                        Cada plano salva suas matérias independentemente, permitindo comparar diferentes combinações sem perder o trabalho anterior.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Controles Laterais:</h5>
                      <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Auto-save</span>
                          <Switch 
                            checked={autoSaveEnabled} 
                            onCheckedChange={setAutoSaveEnabled}
                          />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
                          <Calculator className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">18 créditos</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Auto-save e Contador:</strong> O auto-save mantém seu cronograma salvo automaticamente quando você está logado. 
                        O contador mostra quantos créditos você tem no plano atual, atualizando em tempo real conforme adiciona ou remove matérias.
                      </p>
                    </div>
                  </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                ← Anterior
              </Button>
              <Button onClick={() => { markStepComplete(1); setCurrentStep(2); }}>
                Próximo: Sistema de Três Planos →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Building Schedule */}
        {currentStep === 2 && (
          <motion.div
            key="building-schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <Copy className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Sistema de Três Planos</h2>
              <p className="text-muted-foreground">
                Crie diferentes cenários para maximizar suas chances de sucesso na matrícula
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Como Funciona o Sistema de Planos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O Gradi permite criar até 3 planos diferentes. Cada plano é independente e pode conter matérias diferentes.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-green-700 dark:text-green-300">Plano 1: Sempre Disponível</p>
                        <p className="text-xs text-muted-foreground">Seu plano principal e ideal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-blue-700 dark:text-blue-300">Plano 2: Inicialização Automática</p>
                        <p className="text-xs text-muted-foreground">Ativado quando você o acessa pela primeira vez</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-purple-700 dark:text-purple-300">Plano 3: Requer Plano 2</p>
                        <p className="text-xs text-muted-foreground">Só fica disponível após usar o Plano 2</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                     <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">⚡ Funcionalidade: Copiar Plano</p>
                     <p className="text-xs text-amber-600/80 mt-1">
                       Você pode copiar matérias de um plano para outro usando o diálogo de cópia
                     </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demonstração: Sistema de Planos Interativo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Experimente os botões reais de troca de planos e veja como funciona o bloqueio do Plano 3.
                  </p>
                  
                  <div className="space-y-4">
                    <h5 className="font-medium text-sm">Botões de Planos (como na página schedule):</h5>
                     <div className="flex items-center gap-2 p-4 bg-muted/20 rounded-lg border border-dashed">
                       <Button 
                         variant={activePlan === 1 ? "default" : "outline"} 
                         size="sm"
                         onClick={() => handlePlanClick(1)}
                         className="relative"
                       >
                         Plano 1
                       </Button>
                       <Button 
                         variant={activePlan === 2 ? "default" : "outline"} 
                         size="sm"
                         onClick={() => handlePlanClick(2)}
                         className={`relative ${!plansInitialized.has(2) && activePlan !== 2 ? 'text-muted-foreground border-dashed' : ''}`}
                       >
                         Plano 2
                         {!plansInitialized.has(2) && (
                           <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted"></span>
                           </span>
                         )}
                       </Button>
                       <Button 
                         variant={activePlan === 3 ? "default" : "outline"} 
                         size="sm"
                         onClick={() => handlePlanClick(3)}
                         disabled={isPlan3Disabled}
                         className={`relative ${!plansInitialized.has(3) && activePlan !== 3 ? 'text-muted-foreground border-dashed' : ''} ${isPlan3Disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                       >
                         Plano 3
                         {!plansInitialized.has(3) && !isPlan3Disabled && (
                           <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted"></span>
                           </span>
                         )}
                       </Button>
                     </div>
                     
                     <div className="space-y-2">
                       <h6 className="font-medium text-sm">Status atual:</h6>
                       <div className="p-3 bg-muted/20 rounded-lg border">
                         <p className="text-sm">
                           <strong>Plano ativo:</strong> {activePlan}
                         </p>
                         <p className="text-sm">
                           <strong>Planos inicializados:</strong> {Array.from(plansInitialized).join(', ')}
                         </p>
                         <p className="text-sm">
                           <strong>Plano 3:</strong> {isPlan3Disabled ? "🔒 Bloqueado (use o Plano 2 primeiro)" : "🔓 Desbloqueado"}
                         </p>
                         <p className="text-sm text-muted-foreground">
                           {activePlan === 1 && "✨ Clique no Plano 2 para ver o modal de configuração"}
                           {activePlan === 2 && "✨ Plano 3 agora está desbloqueado! Clique para experimentar"}
                           {activePlan === 3 && "✨ Você está no plano de backup"}
                         </p>
                       </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Como funciona:</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span><strong>Plano 1:</strong> Sempre disponível e é o padrão inicial</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span><strong>Plano 2:</strong> Disponível a qualquer momento com animação pulsante</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span><strong>Plano 3:</strong> Só fica disponível depois de usar o Plano 2</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span><strong>Animação:</strong> Aparece nos botões não utilizados para chamar atenção</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Estratégias para Usar os Três Planos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <h5 className="font-medium text-center">Plano 1: Ideal</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Matérias que você REALMENTE quer</p>
                      <p>• Inclua matérias de alta concorrência</p>
                      <p>• Foque em pré-requisitos importantes</p>
                      <p>• Máximo de créditos possível</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h5 className="font-medium text-center">Plano 2: Realista</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Mix de alta e média concorrência</p>
                      <p>• Considere horários alternativos</p>
                      <p>• Balance carga de trabalho</p>
                      <p>• Mantenha flexibilidade</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <h5 className="font-medium text-center">Plano 3: Backup</h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Matérias de baixa concorrência</p>
                      <p>• Opções sempre disponíveis</p>
                      <p>• Garante que não fique sem nada</p>
                      <p>• Fácil de conseguir vaga</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                ← Anterior
              </Button>
              <Button onClick={() => { markStepComplete(2); setCurrentStep(3); }}>
                Próximo: Análise de Concorrência →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Competition Analysis */}
        {currentStep === 3 && (
          <motion.div
            key="competition-analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Análise de Concorrência</h2>
              <p className="text-muted-foreground">
                Entenda os dados reais de demanda histórica para planejar melhor sua matrícula
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Como Funciona a Análise de Concorrência Real</CardTitle>
                 <CardDescription>
                   O Gradi calcula a concorrência baseado na média de &quot;pedidos sem vaga&quot; dos últimos semestres
                 </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Baixa Concorrência</h4>
                     <div className="mb-3">
                       <CompetitionBadge score={{
                         averageOrdersWithoutVacancy: 3.2,
                         category: "Baixa",
                         semesterCount: 5
                       }} />
                     </div>
                     <p className="text-sm text-muted-foreground mb-2">0 a 5 pedidos sem vaga</p>
                    <p className="text-xs text-muted-foreground">Fácil de conseguir vaga</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Média Concorrência</h4>
                     <div className="mb-3">
                       <CompetitionBadge score={{
                         averageOrdersWithoutVacancy: 9.7,
                         category: "Média",
                         semesterCount: 3
                       }} />
                     </div>
                     <p className="text-sm text-muted-foreground mb-2">5 a 15 pedidos sem vaga</p>
                    <p className="text-xs text-muted-foreground">Moderadamente concorrida</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Alta Concorrência</h4>
                     <div className="mb-3">
                       <CompetitionBadge score={{
                         averageOrdersWithoutVacancy: 18.9,
                         category: "Alta",
                         semesterCount: 4
                       }} />
                     </div>
                     <p className="text-sm text-muted-foreground mb-2">Mais de 15 pedidos sem vaga</p>
                    <p className="text-xs text-muted-foreground">Muito difícil de conseguir</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Demonstração: Tabela de Matérias Real</h4>
                  <TutorialCompetitionDemo />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                ← Anterior
              </Button>
              <Button onClick={() => { markStepComplete(3); setCurrentStep(4); }}>
                Próximo: Auto-save e Persistência →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Auto-save and Features */}
        {currentStep === 4 && (
          <motion.div
            key="auto-save-features"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Auto-save e Persistência</h2>
              <p className="text-muted-foreground">
                Entenda como o Gradi salva automaticamente seu trabalho e sincroniza com sua conta
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span>Auto-save Inteligente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O Gradi possui um sistema de auto-save que funciona em duas camadas: local e na nuvem.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Label htmlFor="auto-save-demo" className="text-sm font-medium cursor-pointer">
                          Auto-save
                        </Label>
                        <Switch
                          id="auto-save-demo"
                          checked={true}
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                      <h5 className="font-medium text-green-700 dark:text-green-300 text-sm">✅ Salvamento Local</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sempre ativo: Suas alterações são salvas no navegador instantaneamente
                      </p>
                    </div>
                    
                     <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                       <h5 className="font-medium text-blue-700 dark:text-blue-300 text-sm">☁️ Salvamento na Nuvem</h5>
                       <p className="text-xs text-muted-foreground mt-1">
                         Com toggle ativado: Sincroniza automaticamente com sua conta (login necessário)
                       </p>
                     </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    <span>Contador de Créditos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O sistema calcula automaticamente os créditos do plano atual baseado nas matérias ativadas.
                  </p>
                  
                   <div className="space-y-3">
                     <div className="flex justify-center">
                       <div className="inline-flex items-center gap-2 p-3 bg-muted/50 rounded-md border">
                         <Calculator className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm font-medium">
                           12 créditos
                         </span>
                       </div>
                     </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Como funciona:</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Conta apenas matérias com checkbox ativado</li>
                        <li>• Atualiza em tempo real conforme você muda</li>
                        <li>• Calcula por plano individual (1, 2 ou 3)</li>
                        <li>• Ajuda a planejar carga de trabalho</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">📊 Dica de Planejamento</p>
                    <p className="text-xs text-purple-600/80 mt-1">
                      A UFSC recomenda 18-24 créditos por semestre para graduação regular
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Save className="h-5 w-5 text-blue-600" />
                  <span>Sistema de Persistência Completo</span>
                </CardTitle>
                <CardDescription>
                  Como seus dados são armazenados e sincronizados entre dispositivos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Status de Sincronização em Tempo Real:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">Salvo na conta</span>
                        <span className="text-xs text-muted-foreground">- Tudo sincronizado</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-600">Alterações não salvas</span>
                        <span className="text-xs text-muted-foreground">- Auto-save detectou mudanças</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600">Grade local</span>
                        <span className="text-xs text-muted-foreground">- Apenas no navegador</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-3">🔐 Faça Login para Mais Recursos!</h5>
                      <div className="space-y-3">
                        <div>
                          <h6 className="text-sm font-medium mb-2">Com Login:</h6>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• ☁️ Salvar grades na nuvem</li>
                            <li>• 📱 Sincronizar entre dispositivos</li>
                            <li>• 👥 Compartilhar com amigos</li>
                            <li>• 📂 Histórico de versões</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium mb-2">Sem Login:</h6>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• 💾 Apenas salvamento local</li>
                            <li>• 🔒 Sem sincronização</li>
                            <li>• 🚫 Sem compartilhamento</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <Link href="/auth/signin">
                      <Button className="w-full" size="sm">
                        Fazer Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Compartilhamento e Colaboração</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Save className="h-6 w-6 text-blue-600" />
                    </div>
                    <h5 className="font-medium mb-2">Salvar Grade</h5>
                    <p className="text-xs text-muted-foreground">
                      Salve sua grade atual com um nome personalizado
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h5 className="font-medium mb-2">Compartilhar</h5>
                    <p className="text-xs text-muted-foreground">
                      Envie grades para amigos ou grupos de estudo
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <h5 className="font-medium mb-2">Gerenciar</h5>
                    <p className="text-xs text-muted-foreground">
                      Acesse e organize todas suas grades salvas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                ← Anterior
              </Button>
              <Button onClick={() => { markStepComplete(4); setCurrentStep(5); }}>
                Próximo: Funcionalidades Avançadas →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Advanced Features */}
        {currentStep === 5 && (
          <motion.div
            key="tips-tricks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <Calculator className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Funcionalidades Avançadas</h2>
              <p className="text-muted-foreground">
                Explore recursos profissionais do Gradi para maximizar seu planejamento acadêmico
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Copy className="h-5 w-5 text-blue-600" />
                  <span>Copy Plan: Gestão Inteligente de Cenários</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  O recurso Copy Plan permite copiar matérias entre planos, criando cenários alternativos rapidamente.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-medium">Como Usar:</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Crie seu Plano 1 ideal</li>
                         <li>• Use a função de cópia para duplicar no Plano 2</li>
                      <li>• Modifique o Plano 2 removendo matérias de alta concorrência</li>
                      <li>• Repita para o Plano 3 com matérias ainda mais seguras</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Opções Disponíveis:</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Replace:</strong> Substitui todo o plano de destino</li>
                      <li>• <strong>Merge:</strong> Adiciona sem remover matérias existentes</li>
                      <li>• <strong>Skip duplicates:</strong> Evita matérias já presentes</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">⚡ Dica Pro</p>
                  <p className="text-xs text-blue-600/80 mt-1">
                    Use Replace quando quiser partir do zero, e Merge quando quiser adicionar matérias específicas
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Interface Redimensionável</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    A interface de três painéis é totalmente redimensionável para se adaptar ao seu fluxo de trabalho.
                  </p>
                  
                  <SubjectsProvider>
                    <div className="border rounded-lg overflow-hidden h-48">
                      <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={40} minSize={25}>
                          <div className="h-full bg-blue-50 dark:bg-blue-950/20 p-3 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Lista de Matérias</span>
                          </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={60}>
                          <div className="h-full bg-green-50 dark:bg-green-950/20 p-3 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">Grade Semanal</span>
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  </SubjectsProvider>

                  <div className="space-y-2 text-sm">
                    <p><strong>Personalize:</strong></p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Arraste as bordas para redimensionar</li>
                      <li>• Configure tamanhos ideais para seu monitor</li>
                      <li>• O layout é salvo automaticamente</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span>Detecção de Conflitos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O WeekCalendarComponent detecta automaticamente conflitos de horário entre matérias.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border-l-4 border-red-500">
                      <h5 className="font-medium text-red-700 dark:text-red-300 text-sm">⚠️ Conflito Detectado</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Quando duas matérias têm horários sobrepostos, são destacadas em vermelho
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border-l-4 border-green-500">
                      <h5 className="font-medium text-green-700 dark:text-green-300 text-sm">✅ Grade Válida</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Grade sem conflitos é exibida com cores normais
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    💡 Use checkboxes para desativar temporariamente matérias e resolver conflitos
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>Recursos Profissionais</span>
                </CardTitle>
                <CardDescription>
                  Funcionalidades que tornam o Gradi uma ferramenta profissional de planejamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center space-x-2">
                      <span className="text-xl">🎨</span>
                      <span>Gestão Automática de Cores</span>
                    </h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• <strong>Sistema de cores único:</strong> Cada matéria recebe automaticamente uma cor única</p>
                      <p>• <strong>Reutilização inteligente:</strong> Cores são liberadas quando matérias são removidas</p>
                      <p>• <strong>Consistência visual:</strong> Mesma matéria sempre tem a mesma cor</p>
                      <p>• <strong>Contraste otimizado:</strong> Cores selecionadas para máxima legibilidade</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium flex items-center space-x-2">
                      <span className="text-xl">⚙️</span>
                      <span>Configurações Inteligentes</span>
                    </h5>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• <strong>Campus Selector:</strong> Filtra matérias por campus automaticamente</p>
                      <p>• <strong>Semester Selector:</strong> Inteligência para semestres .2/.3</p>
                      <p>• <strong>Modal de confirmação:</strong> Previne mudanças acidentais</p>
                      <p>• <strong>Estado persistente:</strong> Seleções salvas entre sessões</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Checklist do Usuário Avançado</span>
                </CardTitle>
                <CardDescription>
                  Domine todas as funcionalidades do Gradi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-medium">🎯 Planejamento Estratégico</h5>
                    <div className="space-y-2">
                      {[
                        "Criar 3 cenários usando os planos",
                        "Analisar concorrência de cada matéria",
                         "Usar cópia de planos para cenários alternativos",
                        "Ativar auto-save para sincronização",
                        "Organizar matérias por prioridade na tabela",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">🚀 Otimizações Avançadas</h5>
                    <div className="space-y-2">
                      {[
                        "Redimensionar painéis para seu fluxo",
                        "Monitorar contador de créditos",
                        "Usar checkboxes para resolver conflitos",
                        "Salvar grades com nomes descritivos",
                        "Compartilhar cenários com amigos",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                ← Anterior
              </Button>
              <Button onClick={() => { markStepComplete(5); }}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Concluir Tutorial
              </Button>
            </div>
          </motion.div>
        )}

        {/* Completion Message */}
        {completedSteps.length === tutorialSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mx-auto max-w-md">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Parabéns! 🎉</h3>
              <p className="text-muted-foreground mb-6">
                Você concluiu o tutorial completo do Gradi. 
                Agora você está pronto para planejar sua vida acadêmica como um expert!
              </p>
              <div className="space-y-3">
                <Link href="/schedule">
                  <Button size="lg" className="w-full">
                    Começar a Usar o Gradi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full" onClick={() => setCurrentStep(0)}>
                  Revisar Tutorial
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer CTA */}
      {currentStep !== 0 && completedSteps.length < tutorialSteps.length - 1 && (
        <div className="bg-muted/30 py-12 mt-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h3 className="text-xl font-bold mb-4">Pronto para começar?</h3>
            <p className="text-muted-foreground mb-6">
              Você pode sair do tutorial a qualquer momento e começar a usar o Gradi
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/schedule">
                <Button>
                  Ir para o Gradi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setCurrentStep(currentStep + 1)}>
                Continuar Tutorial
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={showCopyPlanDialog} onOpenChange={setShowCopyPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Plano {targetPlan}</DialogTitle>
            <DialogDescription>
              Como você deseja configurar este plano? Você pode copiar de um plano existente ou começar vazio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {targetPlan && [1, 2, 3].filter(p => p !== targetPlan && p <= activePlan && plansInitialized.has(p)).length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Copiar de:</h4>
                <div className="flex gap-2">
                  {[1, 2, 3]
                    .filter(p => p !== targetPlan && p <= activePlan && plansInitialized.has(p))
                    .map(planNum => (
                      <Button
                        key={planNum}
                        variant="outline"
                        onClick={() => handleCopyFromPlan(planNum)}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Plano {planNum}
                      </Button>
                    ))
                  }
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <Button
                variant="outline"
                onClick={handleStartEmpty}
                className="gap-2 w-full"
              >
                <FileText className="h-4 w-4" />
                Começar vazio
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCopyPlanDialog(false);
                setTargetPlan(null);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}