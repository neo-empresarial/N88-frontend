"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SelectedSubject from "./components/SelectedSubject";
import SubjectsTable from "./components/SubjectsTable";
import WeekCalendarComponent from "./components/WeekCalendar";
import SearchSubject from "./components/SearchSubject";
import { SubjectsType } from "./types/dataType";

import { useEffect, useState } from "react";
import useAxios from "@/app/api/AxiosInstance";
import { SubjectsProvider } from "./providers/subjectsContext";

export default function SchedulePage() {
  const { getAllSubjects } = useAxios();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  useEffect(() => {
    getAllSubjects().then((data: SubjectsType[]) => {
      setSubjects(data);
      setIsLoadingSubjects(false);
    });
  }, []);

  return (
    <div className="p-10 grid gap-2 grid-cols-1 ">
      <SubjectsProvider>
        <SearchSubject subjects={subjects}/>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-screen rounded-lg border md:min-w-[450px]"
        >
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <SubjectsTable/>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <SelectedSubject />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={50}>
            <WeekCalendarComponent/>
          </ResizablePanel>

          <ResizableHandle />
        </ResizablePanelGroup>
      </SubjectsProvider>
    </div>
  );
}

// export default async function SchedulePageWithProvider() {
//   return <SelectedSubjectContext children={<SchedulePage />} />;
// }
