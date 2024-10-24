"use client";

// import { useContext } from "react";
// import { onFocusSubjectContext } from "../providers/onFocusSubjectContext";

import { useSubjects } from "../providers/subjectsContext";
import { scheduleSubjectsType } from "../providers/subjectsContext";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { weekDays, timeSlots } from "../constants/week-times-and-days";
import { SubjectsType } from "../types/dataType";

import { useTheme } from "next-themes";

function getDayIndex(day: string): number {
  const dayMapping: { [key: string]: number } = {
    segunda: 2,
    terça: 3,
    quarta: 4,
    quinta: 5,
    sexta: 6,
    sábado: 7,
  };
  return dayMapping[day.toLowerCase()] ?? -1; // Returns -1 if no match is found
}

function getSchedulesFromSubjectClass(code: string, classCode: string) {
  const { searchedSubjects } = useSubjects();

  const subject = searchedSubjects.find((subject) => subject.code === code);

  if (!subject) return [];

  const classData = subject.classes.find(
    (classData) => classData.classcode === classCode
  );

  if (!classData) return [];

  return classData.schedules;
}

function formatSubjectsToTableData(subjects: scheduleSubjectsType[]): {
  tableData: { [key: string]: string | string[] }[];
  conflicts: { [key: string]: string | string[] }[];
} {
  const tableData: { [key: string]: string | string[] }[] = [];
  const conflicts: { [key: string]: string | string[] }[] = [];

  // const { searchedSubjects } = useSubjects();

  timeSlots.forEach((time) => {
    weekDays.forEach((day) => {
      if (day === "") return;

      tableData.push({
        time: time,
        day: day,
        code: [],
        color: [],
      });
    });
  });

  subjects.forEach((subject) => {
    subject.classes.forEach((classCode) => {
      const schedules = getSchedulesFromSubjectClass(subject.code, classCode);

      if (!schedules) throw new Error("No schedules found for some reason");

      schedules.forEach((schedule) => {
        const dayIndex = getDayIndex(schedule.weekday);

        if (dayIndex === -1) {
          throw new Error("Invalid day");
        }

        const timeIndex = timeSlots.indexOf(schedule.starttime);

        if (timeIndex === -1) {
          throw new Error("Invalid time");
        }

        
      });
    });
  });

  console.log({ tableData });

  return { tableData, conflicts };
}

function chooseColor(
  data: { [key: string]: string | string[] } | undefined
): string {
  const { theme } = useTheme();
  // const { onFocusSubject } = useContext(onFocusSubjectContext);
  const { onFocusSubject } = useSubjects();

  if (!data) return "";

  if (theme === "light") {
    if (!(data.code === onFocusSubject.code)) {
      return data.color[0];
    } else {
      return "bg-gray-300 border-2 border-black";
    }
  } else {
    if (!(data.code === onFocusSubject.code)) {
      return data.color[1];
    } else {
      return "bg-gray-600 border-2 border-white";
    }
  }
}

export default function WeekCalendarComponent() {
  const { scheduleSubjects } = useSubjects();

  const { tableData, conflicts } = formatSubjectsToTableData(scheduleSubjects);

  return (
    <div className="p-3 max-h-screen">
      <Table>
        {/* <TableCaption>Your weekly schedule</TableCaption> */}
        <TableHeader>
          <TableRow>
            {weekDays.map((day) => (
              <TableHead key={day} className="text-center">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((time) => (
            <TableRow key={time}>
              {weekDays.map((day) =>
                day === "" ? (
                  <TableCell key={`${day}-${time}`} className="w-24">
                    <div className="w-full text-center h-6 font-medium text-muted-foreground">
                      {time}
                    </div>
                  </TableCell>
                ) : (
                  <TableCell key={`${day}-${time}`} className="w-24">
                    <div
                      className={
                        chooseColor(
                          tableData.find(
                            (data) => data.time === time && data.day === day
                          )
                        ) +
                        " " +
                        "w-full flex justify-center items-center h-6 rounded-sm"
                      }
                    >
                      <div className="text-center font-medium">
                        {tableData.find(
                          (data) => data.time === time && data.day === day
                        )?.code || ""}
                      </div>
                    </div>
                  </TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
