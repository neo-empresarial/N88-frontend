"use client";

import { useState, useEffect } from "react";
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

export default function WeekCalendarComponent() {
  const [tableData, setTableData] = useState<
    { [key: string]: string | string[] }[]
  >(generateTimesAndDays());

  const { scheduleSubjects, searchedSubjects, onFocusSubject } = useSubjects();
  const { theme } = useTheme();

  function getDayNameByIndex(index: string): string {
    const dayMapping: { [key: string]: string } = {
      2: "Segunda",
      3: "Terça",
      4: "Quarta",
      5: "Quinta",
      6: "Sexta",
      7: "Sábado",
    };
    return dayMapping[index] ?? "";
  }

  function getColorFromSubject(code: string){
    const subject = searchedSubjects.find((subject) => subject.code === code);
    if (!subject) return "";
    return subject.color;
  }

  function getSchedulesFromSubjectClass(
    code: string,
    classCode: string,
    searchedSubjects: SubjectsType[]
  ) {
    const subject = searchedSubjects.find((subject) => subject.code === code);
    if (!subject) return [];
    const classData = subject.classes.find(
      (classData) => classData.classcode === classCode
    );
    return classData ? classData.schedules : [];
  }

  function generateTimesAndDays() {
    const tableData: { [key: string]: any }[] = [];
    weekDays.forEach((day) => {
      timeSlots.forEach((time) => {
        if (day === "") return;
        tableData.push({
          time: time,
          day: day,
          code: [],
          color: [],
        });
      });
    });
    return tableData;
  }

  function chooseColor(
    data: { [key: string]: string | string[] } | undefined,
    theme: string,
    onFocusSubject: { code: string }
  ): string {
    if (!data) return "";

    if (theme === "light") {
      if (!(data.code === onFocusSubject?.code)) {
        return data.color[0];
      } else {
        return "bg-gray-300 border-2 border-black";
      }
    } else {
      if (!(data.code === onFocusSubject?.code)) {
        return data.color[1];
      } else {
        return "bg-gray-600 border-2 border-white";
      }
    }
  }

  function formatSubjectsToTableData(
    subjects: scheduleSubjectsType[],
    searchedSubjects: SubjectsType[]
  ): { [key: string]: string | string[] }[] {
    const tableData = generateTimesAndDays();

    if (subjects.length === 0) {
      console.log("No subjects found");
      return tableData;
    }

    subjects.forEach((subject) => {
      subject.classes.forEach((classCode) => {
        const schedules = getSchedulesFromSubjectClass(
          subject.code,
          classCode,
          searchedSubjects
        );

        if (!schedules) throw new Error("No schedules found for some reason");

        schedules.forEach((schedule) => {
          const day = getDayNameByIndex(schedule.weekday);
          const time =
            schedule.starttime[0] +
            schedule.starttime[1] +
            ":" +
            schedule.starttime[2] +
            schedule.starttime[3];

          const index = tableData.findIndex(
            (data) => data.time === time && data.day === day
          );

          if (index === -1) {
            console.log("Index not found");
            return;
          }

          for (let i = index; i < index + schedule.classesnumber; i++) {
            tableData[i].code.push(subject.code);
            tableData[i].color.push(getColorFromSubject(subject.code));
          }
        });
      });
    });

    console.log({ tableData });

    return tableData;
  }

  useEffect(() => {
    setTableData(formatSubjectsToTableData(scheduleSubjects, searchedSubjects));
    console.log({ scheduleSubjects });
  }, [scheduleSubjects]);

  return (
    <div className="p-3 max-h-screen">
      <Table>
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
                          ),
                          theme || "light",
                          onFocusSubject
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
