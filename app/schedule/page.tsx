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
import { useContext, useEffect, useState } from "react";
import useAxios from "@/api/AxiosInstance";

const data2 = {
  idsubject: 5,
  code: "ACL5137",
  name: "Micologia Clínica",
  classes: [
    {
      idclass: 14,
      classcode: "07102A",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 20,
          weekday: "3",
          starttime: "0910",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 9,
          name: "Jairo Ivo dos Santos",
        },
      ],
    },
    {
      idclass: 15,
      classcode: "07102B",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 21,
          weekday: "4",
          starttime: "0730",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 9,
          name: "Jairo Ivo dos Santos",
        },
      ],
    },
    {
      idclass: 16,
      classcode: "07102C",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 22,
          weekday: "4",
          starttime: "1330",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 10,
          name: "Iara Fabricia Kretzer",
        },
      ],
    },
    {
      idclass: 17,
      classcode: "07102D",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 23,
          weekday: "5",
          starttime: "0820",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 9,
          name: "Jairo Ivo dos Santos",
        },
      ],
    },
    {
      idclass: 18,
      classcode: "07102E",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 24,
          weekday: "6",
          starttime: "0730",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 9,
          name: "Jairo Ivo dos Santos",
        },
      ],
    },
    {
      idclass: 19,
      classcode: "07102F",
      totalvacancies: 7,
      freevacancies: 0,
      schedules: [
        {
          idschedule: 25,
          weekday: "6",
          starttime: "1330",
          classesnumber: 3,
          building: "CCS",
          room: "K001",
        },
      ],
      professors: [
        {
          idprofessor: 10,
          name: "Iara Fabricia Kretzer",
        },
      ],
    },
  ],
};

// os dados estão diferentes
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

export default function SchedulePage() {
  const { getAllSubjects } = useAxios();
  const [subjects, setSubjects] = useState<SubjectsType[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [interestSubjects, setInterestSubjects] = useState<SubjectsType[]>([]);

  const dataWithColors = interestSubjects.map((subject, index) => {
    return {
      ...subject,
      color: [
        lightColors[index % lightColors.length],
        darkColors[index % darkColors.length],
      ],
    };
  });

  useEffect(() => {
    console.log(dataWithColors);
  }, [dataWithColors]);

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
          <SearchSubject
            interestSubjects={interestSubjects}
            setInterestSubjects={setInterestSubjects}
            subjects={subjects}
            isLoading={isLoadingSubjects}
          />
          <ResizablePanelGroup
            direction="horizontal"
            className="w-screen rounded-lg border md:min-w-[450px] mt-4"
          >
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  <SubjectsTable data={dataWithColors} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                  <SelectedSubject />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <WeekCalendarComponent data={dataWithColors} />
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
