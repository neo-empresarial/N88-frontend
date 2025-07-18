﻿"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SelectedSubject from "./components/SelectedSubject";
import SubjectsTable from "./components/SubjectsTable";
import WeekCalendarComponent from "./components/WeekCalendar";
import SearchSubject from "./components/SearchSubject";
import SaveScheduleDialog from "./components/SaveScheduleDialog";
import SavedSchedulesDialog from "./components/SavedSchedulesDialog";
import ReceivedSharedSchedulesDialog from "./components/ReceivedSharedSchedulesDialog";
import { SubjectsType } from "./types/dataType";

import { useEffect, useState } from "react";
import useAxios from "@/app/api/AxiosInstance";
import { SubjectsProvider } from "./providers/subjectsContext";
import CreditsCounter from "./components/creditsCounter";

export default function SchedulePage() {
  const { getAllSubjects } = useAxios();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);

  useEffect(() => {
    getAllSubjects().then((data: SubjectsType[]) => {
      setSubjects(data);
    });
  }, []);

  return (
    <div className="p-10 grid gap-2 grid-cols-1 ">
      <SubjectsProvider>
        <div className="flex items-center gap-4 mb-4">
          <SearchSubject subjects={subjects} />
          <div className="flex gap-2">
            <SaveScheduleDialog />
            <SavedSchedulesDialog />
            <ReceivedSharedSchedulesDialog />
          </div>

        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-screen rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <SubjectsTable />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <SelectedSubject />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50}>
            <WeekCalendarComponent />
          </ResizablePanel>

          <ResizableHandle />
        </ResizablePanelGroup>
      </SubjectsProvider>
    </div>
  );
}
