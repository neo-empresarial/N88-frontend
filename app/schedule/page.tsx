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
import { lightColors, darkColors } from "./constants/colors";
import { DataType, SubjectsType } from "./types/dataType";

import SelectedSubjectContext from "./providers/selectedSubjectContext";
import OnFocusSubjectProvider from "./providers/onFocusSubjectContext";
import { useEffect, useState } from "react";
import useAxios from "@/api/AxiosInstance";

const data = {
  idsavedschedule: 7,
  code: "user7",
  subjects: [
    {
      idsubject: 23,
      code: "ACL5135",
      name: "Hematologia Clínica",
      classes: [
        {
          idclass: 1,
          classcode: "06102G",
          totalvacancies: 7,
          freevacancies: 4,
          schedules: [
            {
              idschedule: 30,
              weekday: "3",
              starttime: "13:30",
              classesnumber: 4,
              building: "CCS",
              room: "K101",
            },
            {
              idschedule: 23,
              weekday: "2",
              starttime: "10:10",
              classesnumber: 2,
              building: "CCS",
              room: "J006",
            },
          ],
          professors: [
            {
              idprofessor: 8,
              name: "Solange Lucia Blatt",
            },
          ],
        },
      ],
    },
    {
      idsubject: 24,
      code: "ACL5136",
      name: "Uroanálise [Cancelada]",
      classes: [
        {
          idclass: 2,
          classcode: "06102A",
          totalvacancies: 0,
          freevacancies: 0,
          schedules: [
            {
              idschedule: 31,
              weekday: "3",
              starttime: "09:10",
              classesnumber: 3,
              building: "AUX",
              room: "ALOCAR\n",
            },
          ],
          professors: [
            {
              idprofessor: 11,
              name: "Dirleise Colle",
            },
          ],
        },
      ],
    },
  ],
};

function defineColorToEachSubject({
  data,
}: {
  data: DataType;
}): SubjectsType[] {
  const subjects_with_color: SubjectsType[] = data.subjects.map(
    (subject, index) => {
      return {
        ...subject,
        color: [
          lightColors[index % lightColors.length],
          darkColors[index % darkColors.length],
        ],
      };
    }
  );

  return subjects_with_color;
}

export default function SchedulePage() {
  const { getAllSubjects } = useAxios();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const subjects_with_color = defineColorToEachSubject({ data });

  useEffect(() => {
    getAllSubjects().then((data) => {
      setSubjects(data);
      setIsLoadingSubjects(false);
    });
  }, []);

  return (
    <div className="p-10">
      <SelectedSubjectContext>
        <OnFocusSubjectProvider>
          <SearchSubject subjects={subjects} isLoading={isLoadingSubjects} />
          <ResizablePanelGroup
            direction="horizontal"
            className="w-screen rounded-lg border md:min-w-[450px] mt-4"
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
              <WeekCalendarComponent data={subjects_with_color} />
            </ResizablePanel>

            <ResizableHandle />
          </ResizablePanelGroup>
        </OnFocusSubjectProvider>
      </SelectedSubjectContext>
    </div>
  );
}

// export default async function SchedulePageWithProvider() {
//   return <SelectedSubjectContext children={<SchedulePage />} />;
// }
