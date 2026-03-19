import React, { useContext, useEffect, useCallback, createContext, useState } from "react";
import { SubjectsType } from "../types/dataType";
import { restoreColorUsage } from "../utils/colorUtils";
import { useSemestersQuery } from "@/app/hooks/useSemesters";

export type scheduleSubjectsType = {
  code: string;
  class: string;
  color?: string;
  activated: boolean;
  schedules?: string;
};

type LocalSaveStatus = "idle" | "saving" | "saved" | "modified";
type PlanNumber = 1 | 2 | 3;

type PlanData = {
  scheduleSubjects: scheduleSubjectsType[];
  searchedSubjects: SubjectsType[];
  selectedSubject: SubjectsType;
  onFocusSubject: { code: string };
  onFocusSubjectClass: { code: string; classcode: string };
};

type SubjectsContextType = {
  searchedSubjects: SubjectsType[];
  setSearchedSubjects: React.Dispatch<React.SetStateAction<SubjectsType[]>>;
  scheduleSubjects: scheduleSubjectsType[];
  setScheduleSubjects: React.Dispatch<
    React.SetStateAction<scheduleSubjectsType[]>
  >;
  selectedSubject: SubjectsType;
  setSelectedSubject: React.Dispatch<React.SetStateAction<SubjectsType>>;
  onFocusSubject: { code: string };
  setOnFocusSubject: React.Dispatch<React.SetStateAction<{ code: string }>>;
  onFocusSubjectClass: { code: string; classcode: string };
  setOnFocusSubjectClass: React.Dispatch<
    React.SetStateAction<{ code: string; classcode: string }>
  >;
  currentScheduleId: number | null;
  setCurrentScheduleId: React.Dispatch<React.SetStateAction<number | null>>;
  totalCredits: number;
  setTotalCredits: React.Dispatch<React.SetStateAction<number>>;
  localSaveStatus: LocalSaveStatus;
  clearLocalSchedule: () => void;
  clearCurrentPlan: () => void;
  resetToDefault: () => void;
  scheduleTitle: string;
  setScheduleTitle: React.Dispatch<React.SetStateAction<string>>;
  currentPlan: PlanNumber;
  setCurrentPlan: (plan: PlanNumber) => void;
  showCopyPlanDialog: boolean;
  setShowCopyPlanDialog: React.Dispatch<React.SetStateAction<boolean>>;
  targetPlan: PlanNumber | null;
  setTargetPlan: React.Dispatch<React.SetStateAction<PlanNumber | null>>;
  copyPlanData: (sourcePlan: PlanNumber, targetPlan: PlanNumber) => void;
  markPlanAsInitialized: (plan: PlanNumber) => void;
  loadFullSchedule: (data: {
    plansData: Record<PlanNumber, PlanData>;
    title: string;
    id: number;
    initializedPlans: PlanNumber[];
  }) => void;
  plansInitialized: Set<PlanNumber>;
  plansData: Record<PlanNumber, PlanData>;
  isDirty: boolean;
  lastSavedState: Record<PlanNumber, PlanData> | null;
  markAsSaved: () => void;
  calculateTotalCredits: () => number;
  calculateCurrentPlanCredits: () => number;
  autoSaveEnabled: boolean;
  setAutoSaveEnabled: (enabled: boolean) => void;
  getPlansDataForSave: () => {
    planNumber: number;
    items: {
      subjectCode: string;
      classCode: string;
      activated: boolean;
      credits: number;
    }[];
  }[];
  selectedSemester: string | null;
  setSelectedSemester: (semester: string | null) => void;
  setSelectedSemesterDirectly: (semester: string | null) => void;
  showSemesterChangeModal: boolean;
  setShowSemesterChangeModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmSemesterChange: (newSemester: string) => void;
  cancelSemesterChange: () => void;
  pendingSemester: string | null;
  isResetting: boolean;
};

const STORAGE_KEY = "schedule_subjects";
const SEARCHED_SUBJECTS_KEY = "searched_subjects";
const STORAGE_TITLE_KEY = "schedule_title";
const STORAGE_CURRENT_ID_KEY = "current_schedule_id";
const STORAGE_CURRENT_PLAN_KEY = "current_plan";
const STORAGE_PLANS_DATA_KEY = "plans_data";
const STORAGE_PLANS_INITIALIZED_KEY = "plans_initialized";
const STORAGE_AUTO_SAVE_ENABLED_KEY = "auto_save_enabled";
const STORAGE_SELECTED_SEMESTER_KEY = "selected_semester";

const emptyPlanData = (): PlanData => ({
  scheduleSubjects: [],
  searchedSubjects: [],
  selectedSubject: {} as SubjectsType,
  onFocusSubject: { code: "" },
  onFocusSubjectClass: { code: "", classcode: "" },
});

export const SubjectsContext = createContext<SubjectsContextType>({
  searchedSubjects: [],
  setSearchedSubjects: () => {},
  scheduleSubjects: [],
  setScheduleSubjects: () => {},
  selectedSubject: {} as SubjectsType,
  setSelectedSubject: () => {},
  onFocusSubject: { code: "" },
  setOnFocusSubject: () => {},
  onFocusSubjectClass: { code: "", classcode: "" },
  setOnFocusSubjectClass: () => {},
  currentScheduleId: null,
  setCurrentScheduleId: () => {},
  totalCredits: 0,
  setTotalCredits: () => {},
  localSaveStatus: "idle",
  clearLocalSchedule: () => {},
  clearCurrentPlan: () => {},
  resetToDefault: () => {},
  scheduleTitle: "Grade sem título",
  setScheduleTitle: () => {},
  currentPlan: 1,
  setCurrentPlan: () => {},
  showCopyPlanDialog: false,
  setShowCopyPlanDialog: () => {},
  targetPlan: null,
  setTargetPlan: () => {},
  copyPlanData: () => {},
  markPlanAsInitialized: () => {},
  loadFullSchedule: () => {},
  plansInitialized: new Set<PlanNumber>([1]),
  plansData: {
    1: emptyPlanData(),
    2: emptyPlanData(),
    3: emptyPlanData(),
  },
  isDirty: false,
  lastSavedState: null,
  markAsSaved: () => {},
  calculateTotalCredits: () => 0,
  calculateCurrentPlanCredits: () => 0,
  autoSaveEnabled: true,
  setAutoSaveEnabled: () => {},
  getPlansDataForSave: () => [],
  selectedSemester: null,
  setSelectedSemester: () => {},
  setSelectedSemesterDirectly: () => {},
  showSemesterChangeModal: false,
  setShowSemesterChangeModal: () => {},
  confirmSemesterChange: () => {},
  cancelSemesterChange: () => {},
  pendingSemester: null,
  isResetting: false,
});

export function SubjectsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [plansInitialized, setPlansInitialized] = useState<Set<PlanNumber>>(new Set<PlanNumber>([1]));
  const [plansData, setPlansData] = useState<Record<PlanNumber, PlanData>>({
    1: emptyPlanData(),
    2: emptyPlanData(),
    3: emptyPlanData(),
  });
  const [internalCurrentPlan, setInternalCurrentPlan] = useState<PlanNumber>(1);
  const [currentScheduleId, setCurrentScheduleId] = useState<number | null>(null);
  const [scheduleTitle, setScheduleTitle] = useState<string>("Grade sem título");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const savedAutoSaveEnabled = localStorage.getItem(STORAGE_AUTO_SAVE_ENABLED_KEY);
      return savedAutoSaveEnabled !== null ? savedAutoSaveEnabled === "true" : true;
    } catch (error) {
      return true;
    }
  });

  const [selectedSemester, setSelectedSemester] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(STORAGE_SELECTED_SEMESTER_KEY);
    } catch (error) {
      return null;
    }
  });

  const [showSemesterChangeModal, setShowSemesterChangeModal] = useState(false);
  const [pendingSemester, setPendingSemester] = useState<string | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [localSaveStatus, setLocalSaveStatus] = useState<LocalSaveStatus>("idle");

  // Fetch semesters for default selection
  const { data: semesters } = useSemestersQuery();

  // Set default semester to the latest (backend returns semesters ordered DESC)
  // Only set if nothing is saved in localStorage (selectedSemester === null)
  // and if there are no active subjects (safe to overwrite)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedSemester !== null) return; // respect saved value
    if (!semesters || semesters.length === 0) return;
    // If there are active subjects, avoid automatic switch (safety)
    const hasActiveSubjects = Object.values(plansData).some(plan => 
      plan.scheduleSubjects && plan.scheduleSubjects.length > 0
    );
    if (hasActiveSubjects) return;
    // Set silently (do not use handleSemesterChange which triggers confirmation)
    setSelectedSemester(semesters[0].semester);
  }, [semesters, selectedSemester, plansData, setSelectedSemester]);

  useEffect(() => {
    if (typeof window === "undefined" || isHydrated) return;
    
    setIsResetting(true);
    
    try {
      const savedInitialized = localStorage.getItem(STORAGE_PLANS_INITIALIZED_KEY);
      if (savedInitialized) {
        setPlansInitialized(new Set<PlanNumber>(JSON.parse(savedInitialized)));
      }

      const savedPlansData = localStorage.getItem(STORAGE_PLANS_DATA_KEY);
      if (savedPlansData) {
        setPlansData(JSON.parse(savedPlansData));
      } else {
        const oldScheduleSubjects = localStorage.getItem(STORAGE_KEY);
        const oldSearchedSubjects = localStorage.getItem(SEARCHED_SUBJECTS_KEY);
        
        if (oldScheduleSubjects || oldSearchedSubjects) {
          const plan1Data: PlanData = {
            scheduleSubjects: oldScheduleSubjects ? JSON.parse(oldScheduleSubjects) : [],
            searchedSubjects: oldSearchedSubjects ? JSON.parse(oldSearchedSubjects) : [],
            selectedSubject: {} as SubjectsType,
            onFocusSubject: { code: "" },
            onFocusSubjectClass: { code: "", classcode: "" },
          };
          
          setPlansData({
            1: plan1Data,
            2: emptyPlanData(),
            3: emptyPlanData(),
          });
        }
      }

      const savedPlan = localStorage.getItem(STORAGE_CURRENT_PLAN_KEY);
      if (savedPlan) {
        const plan = parseInt(savedPlan) as PlanNumber;
        if ([1, 2, 3].includes(plan)) {
          setInternalCurrentPlan(plan);
        }
      }

      const savedId = localStorage.getItem(STORAGE_CURRENT_ID_KEY);
      if (savedId) {
        setCurrentScheduleId(parseInt(savedId));
      }

      const savedTitle = localStorage.getItem(STORAGE_TITLE_KEY);
      if (savedTitle) {
        setScheduleTitle(savedTitle);
      }

      if (savedId) {
        setLocalSaveStatus("saved");
      } else {
        setLocalSaveStatus("idle");
      }

      setIsHydrated(true);
      
      setTimeout(() => {
        setIsResetting(false);
      }, 100);
    } catch (error) {
      console.error("Error hydrating from localStorage:", error);
      setIsHydrated(true);
      setTimeout(() => {
        setIsResetting(false);
      }, 100);
    }
  }, [isHydrated]);

  const [showCopyPlanDialog, setShowCopyPlanDialog] = useState(false);
  const [targetPlan, setTargetPlan] = useState<PlanNumber | null>(null);

  // Current plan data accessors
  const currentPlanData = plansData[internalCurrentPlan];
  const scheduleSubjects = currentPlanData.scheduleSubjects;
  const searchedSubjects = currentPlanData.searchedSubjects;
  const selectedSubject = currentPlanData.selectedSubject;
  const onFocusSubject = currentPlanData.onFocusSubject;
  const onFocusSubjectClass = currentPlanData.onFocusSubjectClass;

  // Setters that update current plan
  const setScheduleSubjects = useCallback((value: React.SetStateAction<scheduleSubjectsType[]>) => {
    setPlansData(prev => {
      const newScheduleSubjects = typeof value === 'function' 
        ? value(prev[internalCurrentPlan].scheduleSubjects) 
        : value;
      return {
        ...prev,
        [internalCurrentPlan]: {
          ...prev[internalCurrentPlan],
          scheduleSubjects: newScheduleSubjects,
        },
      };
    });
    
    if (!isLoadingSchedule && !isResetting) {
      setLocalSaveStatus("modified");
    }
  }, [internalCurrentPlan, isLoadingSchedule, isResetting]);

  const setSearchedSubjects = useCallback((value: React.SetStateAction<SubjectsType[]>) => {
    setPlansData(prev => {
      const newSearchedSubjects = typeof value === 'function'
        ? value(prev[internalCurrentPlan].searchedSubjects)
        : value;
      return {
        ...prev,
        [internalCurrentPlan]: {
          ...prev[internalCurrentPlan],
          searchedSubjects: newSearchedSubjects,
        },
      };
    });
  }, [internalCurrentPlan]);

  const setSelectedSubject = useCallback((value: React.SetStateAction<SubjectsType>) => {
    setPlansData(prev => {
      const newSelectedSubject = typeof value === 'function'
        ? value(prev[internalCurrentPlan].selectedSubject)
        : value;
      return {
        ...prev,
        [internalCurrentPlan]: {
          ...prev[internalCurrentPlan],
          selectedSubject: newSelectedSubject,
        },
      };
    });
  }, [internalCurrentPlan]);

  const setOnFocusSubject = useCallback((value: React.SetStateAction<{ code: string }>) => {
    setPlansData(prev => {
      const newOnFocusSubject = typeof value === 'function'
        ? value(prev[internalCurrentPlan].onFocusSubject)
        : value;
      return {
        ...prev,
        [internalCurrentPlan]: {
          ...prev[internalCurrentPlan],
          onFocusSubject: newOnFocusSubject,
        },
      };
    });
  }, [internalCurrentPlan]);

  const setOnFocusSubjectClass = useCallback((value: React.SetStateAction<{ code: string; classcode: string }>) => {
    setPlansData(prev => {
      const newOnFocusSubjectClass = typeof value === 'function'
        ? value(prev[internalCurrentPlan].onFocusSubjectClass)
        : value;
      return {
        ...prev,
        [internalCurrentPlan]: {
          ...prev[internalCurrentPlan],
          onFocusSubjectClass: newOnFocusSubjectClass,
        },
      };
    });
  }, [internalCurrentPlan]);

  const setScheduleTitleWithModify = useCallback((title: string | ((prevState: string) => string)) => {
    const newTitle = typeof title === "function" ? title(scheduleTitle) : title;
    setScheduleTitle(newTitle);
    if (!isLoadingSchedule && !isResetting) {
      setLocalSaveStatus("modified");
    }
  }, [isLoadingSchedule, isResetting, scheduleTitle]);

  // Mark data as saved and update last saved state
  const markAsSaved = useCallback(() => {
    setLocalSaveStatus("saved");
  }, []);

  const calculateTotalCredits = useCallback(() => {
    let totalCredits = 0;
    
    Object.values(plansData).forEach(plan => {
      plan.scheduleSubjects.forEach(scheduleSubject => {
        if (!scheduleSubject.activated) return;
        
        const fullSubjectData = plan.searchedSubjects.find(
          s => s.code === scheduleSubject.code
        );
        
        if (fullSubjectData) {
          const targetClass = fullSubjectData.classes.find(
            c => c.classcode === scheduleSubject.class
          );
          
          if (targetClass) {
            targetClass.schedules.forEach(schedule => {
              totalCredits += schedule.classesnumber;
            });
          }
        }
      });
    });
    
    return totalCredits;
  }, [plansData]);

  const calculateCurrentPlanCredits = useCallback(() => {
    let planCredits = 0;
    const currentPlanData = plansData[internalCurrentPlan];
    
    currentPlanData.scheduleSubjects.forEach(scheduleSubject => {
      if (!scheduleSubject.activated) return;
      
      const fullSubjectData = currentPlanData.searchedSubjects.find(
        s => s.code === scheduleSubject.code
      );
      
      if (fullSubjectData) {
        const targetClass = fullSubjectData.classes.find(
          c => c.classcode === scheduleSubject.class
        );
        
        if (targetClass) {
          targetClass.schedules.forEach(schedule => {
            planCredits += schedule.classesnumber;
          });
        }
      }
    });
    
    return planCredits;
  }, [plansData, internalCurrentPlan]);

  const calculateCreditsForSubject = useCallback((subjectCode: string, classCode: string, planNumber: 1|2|3) => {
    const plan = plansData[planNumber];
    const fullSubjectData = plan.searchedSubjects.find(s => s.code === subjectCode);
    
    if (fullSubjectData) {
      const targetClass = fullSubjectData.classes.find(c => c.classcode === classCode);
      
      if (targetClass) {
        return targetClass.schedules.reduce((sum, schedule) => sum + schedule.classesnumber, 0);
      }
    }
    
    return 0;
  }, [plansData]);

  const getPlansDataForSave = useCallback(() => {
    const plans: {
      planNumber: number;
      items: {
        subjectCode: string;
        classCode: string;
        activated: boolean;
        credits: number;
      }[];
    }[] = [];

    Object.entries(plansData).forEach(([planNumberStr, plan]) => {
      const planNumber = parseInt(planNumberStr) as 1|2|3;
      const items = plan.scheduleSubjects.map(subject => ({
        subjectCode: subject.code,
        classCode: subject.class,
        activated: subject.activated,
        credits: calculateCreditsForSubject(subject.code, subject.class, planNumber),
      }));

      if (items.length > 0) {
        plans.push({ planNumber, items });
      }
    });

    return plans;
  }, [plansData, calculateCreditsForSubject]);

  // Auto-save functionality with 2-second delay
  useEffect(() => {
    if (!autoSaveEnabled || localSaveStatus !== "modified" || !currentScheduleId) return;

    const hasAnySubjects = Object.values(plansData).some(plan => 
      plan.scheduleSubjects && plan.scheduleSubjects.length > 0
    );
    
    if (!hasAnySubjects) {
      return;
    }

    const autoSaveTimer = setTimeout(() => {
      const autoSaveEvent = new CustomEvent('autoSaveSchedule', { 
        detail: { 
          plans: getPlansDataForSave(),
          currentScheduleId, 
          scheduleTitle 
        } 
      });
      window.dispatchEvent(autoSaveEvent);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [autoSaveEnabled, localSaveStatus, currentScheduleId, plansData, scheduleTitle]);

  const setCurrentPlan = useCallback((plan: PlanNumber) => {
    if (!plansInitialized.has(plan)) {
      // Show dialog to ask if user wants to copy from another plan
      setTargetPlan(plan);
      setShowCopyPlanDialog(true);
    } else {
      setInternalCurrentPlan(plan);
    }
  }, [plansInitialized]);

  // Copy plan data from source to target
  const copyPlanData = useCallback((sourcePlan: PlanNumber, targetPlan: PlanNumber) => {
    setPlansData(prev => {
      const sourceData = prev[sourcePlan];
      // Deep clone the data to avoid references
      return {
        ...prev,
        [targetPlan]: {
          scheduleSubjects: JSON.parse(JSON.stringify(sourceData.scheduleSubjects)),
          searchedSubjects: JSON.parse(JSON.stringify(sourceData.searchedSubjects)),
          selectedSubject: JSON.parse(JSON.stringify(sourceData.selectedSubject)),
          onFocusSubject: { ...sourceData.onFocusSubject },
          onFocusSubjectClass: { ...sourceData.onFocusSubjectClass },
        },
      };
    });

    // Mark target plan as initialized
    setPlansInitialized(prev => new Set([...Array.from(prev), targetPlan]));
    setInternalCurrentPlan(targetPlan);
  }, []);

  // Mark a plan as initialized and switch to it
  const markPlanAsInitialized = useCallback((plan: PlanNumber) => {
    setPlansInitialized(prev => new Set([...Array.from(prev), plan]));
    setInternalCurrentPlan(plan);
  }, []);

  const loadFullSchedule = useCallback((data: {
    plansData: Record<PlanNumber, PlanData>;
    title: string;
    id: number;
    initializedPlans: PlanNumber[];
  }) => {
    setIsLoadingSchedule(true);
    
    setPlansData(data.plansData);
    setScheduleTitle(data.title);
    setCurrentScheduleId(data.id);
    setPlansInitialized(new Set(data.initializedPlans));
    setInternalCurrentPlan(1);
    setLocalSaveStatus("saved");
    
    // Use setTimeout to ensure the flag is cleared after all state updates
    setTimeout(() => {
      setIsLoadingSchedule(false);
    }, 100);
  }, []);

  // Reset everything to default state (only Plan 1, no subjects)
  const resetToDefault = useCallback(() => {
    setIsResetting(true);
    
    // Reset plans data to initial state
    const initialPlansData: Record<PlanNumber, PlanData> = {
      1: emptyPlanData(),
      2: emptyPlanData(),
      3: emptyPlanData(),
    };
    setPlansData(initialPlansData);
    
    // Reset initialized plans to only Plan 1
    setPlansInitialized(new Set<PlanNumber>([1]));
    
    // Reset to Plan 1
    setInternalCurrentPlan(1);
    
    // Clear schedule metadata
    setCurrentScheduleId(null);
    setScheduleTitle("Grade sem título");
    setLocalSaveStatus("idle");
    
    if (semesters && semesters.length > 0) {
      setSelectedSemester(semesters[0].semester);
    }
    
    // Clear all localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SEARCHED_SUBJECTS_KEY);
        localStorage.removeItem(STORAGE_TITLE_KEY);
        localStorage.removeItem(STORAGE_CURRENT_ID_KEY);
        localStorage.removeItem(STORAGE_CURRENT_PLAN_KEY);
        localStorage.removeItem(STORAGE_PLANS_DATA_KEY);
        localStorage.removeItem(STORAGE_PLANS_INITIALIZED_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
    
    // Clear the resetting flag after all state updates
    setTimeout(() => {
      setIsResetting(false);
    }, 100);
  }, [semesters]);

  // Semester change logic
  const handleSemesterChange = useCallback((newSemester: string | null) => {
    if (newSemester === selectedSemester) return;
    
    // Check if any plan has active subjects
    const hasActiveSubjects = Object.values(plansData).some(plan => 
      plan.scheduleSubjects && plan.scheduleSubjects.length > 0
    );
    
    if (hasActiveSubjects && !isLoadingSchedule) {
      // Show confirmation modal
      setPendingSemester(newSemester);
      setShowSemesterChangeModal(true);
    } else {
      // No active subjects, change directly
      setSelectedSemester(newSemester);
    }
  }, [selectedSemester, plansData, isLoadingSchedule]);

  const confirmSemesterChange = useCallback((newSemester: string) => {
    const targetSemester = newSemester || pendingSemester;
    if (!targetSemester) return;
    
    // Trigger auto-save if there are unsaved changes
    if (autoSaveEnabled && localSaveStatus === "modified" && currentScheduleId) {
      const autoSaveEvent = new CustomEvent('autoSaveSchedule', { 
        detail: { 
          plans: getPlansDataForSave(),
          currentScheduleId, 
          scheduleTitle 
        } 
      });
      window.dispatchEvent(autoSaveEvent);
    }
    
    // Reset to default state (clear all plans)
    resetToDefault();
    
    // Set new semester
    setSelectedSemester(targetSemester);
    
    // Close modal
    setShowSemesterChangeModal(false);
    setPendingSemester(null);
  }, [autoSaveEnabled, localSaveStatus, currentScheduleId, getPlansDataForSave, scheduleTitle, resetToDefault, pendingSemester]);

  const cancelSemesterChange = useCallback(() => {
    setShowSemesterChangeModal(false);
    setPendingSemester(null);
  }, []);

  const setSelectedSemesterDirectly = useCallback((semester: string | null) => {
    setSelectedSemester(semester);
  }, []);

  // Clear all plans and reset to default state (for "Nova Grade" button)
  const clearLocalSchedule = useCallback(() => {
    resetToDefault();
  }, [resetToDefault]);

  // Clear only the current plan's subjects (local action)
  const clearCurrentPlan = useCallback(() => {
    setPlansData(prev => ({
      ...prev,
      [internalCurrentPlan]: emptyPlanData(),
    }));
    if (!isLoadingSchedule && !isResetting) {
      setLocalSaveStatus("modified");
    }
  }, [internalCurrentPlan, isLoadingSchedule, isResetting]);

  // Restore color usage on mount
  useEffect(() => {
    const allSubjects = Object.values(plansData).flatMap(plan => plan.searchedSubjects);
    if (allSubjects.length > 0) {
      const pairs = allSubjects
        .filter((s) => s.color)
        .map((s) => s.color as [string, string]);
      restoreColorUsage(pairs);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist plans data to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_PLANS_DATA_KEY, JSON.stringify(plansData));
      
      // Also save to old keys for backwards compatibility with plan 1
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plansData[1].scheduleSubjects));
      localStorage.setItem(SEARCHED_SUBJECTS_KEY, JSON.stringify(plansData[1].searchedSubjects));
      
      // Do NOT change localSaveStatus here - localStorage saving is different from account saving
    } catch (error) {
      console.error("Error saving plans data to localStorage:", error);
    }
  }, [plansData]);

  // Persist plans initialized status
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_PLANS_INITIALIZED_KEY, JSON.stringify(Array.from(plansInitialized)));
    } catch (error) {
      console.error("Error saving plans initialized status:", error);
    }
  }, [plansInitialized]);

  // Persist schedule title
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_TITLE_KEY, scheduleTitle);
    } catch (error) {}
  }, [scheduleTitle]);

  // Persist current schedule ID
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (currentScheduleId !== null) {
        localStorage.setItem(STORAGE_CURRENT_ID_KEY, currentScheduleId.toString());
      } else {
        localStorage.removeItem(STORAGE_CURRENT_ID_KEY);
      }
    } catch (error) {}
  }, [currentScheduleId]);

  // Persist current plan
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_CURRENT_PLAN_KEY, internalCurrentPlan.toString());
    } catch (error) {}
  }, [internalCurrentPlan]);

  // Persist auto-save enabled state
  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    try {
      localStorage.setItem(STORAGE_AUTO_SAVE_ENABLED_KEY, autoSaveEnabled.toString());
    } catch (error) {}
  }, [autoSaveEnabled, isHydrated]);

  // Persist selected semester
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (selectedSemester !== null) {
        localStorage.setItem(STORAGE_SELECTED_SEMESTER_KEY, selectedSemester);
      } else {
        localStorage.removeItem(STORAGE_SELECTED_SEMESTER_KEY);
      }
    } catch (error) {}
  }, [selectedSemester]);

  return (
    <SubjectsContext.Provider
      value={{
        searchedSubjects,
        setSearchedSubjects,
        scheduleSubjects,
        setScheduleSubjects,
        selectedSubject,
        setSelectedSubject,
        onFocusSubject,
        setOnFocusSubject,
        onFocusSubjectClass,
        setOnFocusSubjectClass,
        currentScheduleId,
        setCurrentScheduleId,
        totalCredits,
        setTotalCredits,
        localSaveStatus,
        clearLocalSchedule,
        clearCurrentPlan,
        resetToDefault,
        scheduleTitle,
        setScheduleTitle: setScheduleTitleWithModify,
        currentPlan: internalCurrentPlan,
        setCurrentPlan,
        showCopyPlanDialog,
        setShowCopyPlanDialog,
        targetPlan,
        setTargetPlan,
        copyPlanData,
        markPlanAsInitialized,
        loadFullSchedule,
        plansInitialized,
        plansData,
        isDirty: false,
        lastSavedState: null,
        markAsSaved,
        calculateTotalCredits,
        calculateCurrentPlanCredits,
        autoSaveEnabled,
        setAutoSaveEnabled,
        getPlansDataForSave,
        selectedSemester,
        setSelectedSemester: handleSemesterChange,
        setSelectedSemesterDirectly,
        showSemesterChangeModal,
        setShowSemesterChangeModal,
        confirmSemesterChange,
        cancelSemesterChange,
        pendingSemester,
        isResetting,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}
