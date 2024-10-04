import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SelectedSubject from "./components/SelectedSubject";
import SubjectsTable from "./components/SubjectsTable";
import WeekCalendarComponent from "./components/WeekCalendar";
import { lightColors, darkColors } from "./constants/colors";
import { DataType, SubjectsType } from "./types/dataType";

const data = {
  idsavedschedule: 7,
  code: "user7",
  subjects: [
    {
      idsubject: 23,
      code: "ACL5135",
      classcode: "06102G",
      name: "Hematologia Clínica",
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
    {
      idsubject: 24,
      code: "ACL5136",
      classcode: "06102A",
      name: "Uroanálise [Cancelada]",
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

export default async function SchedulePage() {
  const subjects_with_color = defineColorToEachSubject({ data });

  return (
    <div className="p-10">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <SubjectsTable data={subjects_with_color} />
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
    </div>
  );
}
