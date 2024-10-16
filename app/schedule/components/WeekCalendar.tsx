"use client";

import { useContext } from "react";
import { onFocusSubjectContext } from "../providers/onFocusSubjectContext";

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

function formatSubjectsToTableData(subjects: SubjectsType[]): {
  formattedData: { [key: string]: string | string[] }[];
  conflicts: { [key: string]: string | string[] }[];
} {
  const formattedData: { [key: string]: string | string[] }[] = [];
  const conflicts: { [key: string]: string | string[] }[] = [];

  timeSlots.forEach((time) => {
    weekDays.forEach((day) => {
      if (day === "") return;

      formattedData.push({
        time: time,
        day: day,
        code: "",
        color: "",
      });

      const subject = subjects.filter((subject) => {
        return subject.classes.find((classData) => {
          return classData.schedules.find((schedule) => {
            const class_start_time = timeSlots.findIndex(
              (t) => t === schedule.starttime
            );
            const class_end_time =
              class_start_time + schedule.classesnumber - 1;

            const condition =
              getDayIndex(day) === Number(schedule.weekday) &&
              timeSlots.indexOf(time) >= class_start_time &&
              timeSlots.indexOf(time) <= class_end_time;

            return condition;
          });
        });
      });

      if (subject.length > 1) {
        conflicts.push({
          subjects: subject.map((s) => s.code),
          time: time,
        });
        formattedData[formattedData.length - 1].code = subject[subject.length - 1].code;
        formattedData[formattedData.length - 1].color = "bg-rose-800";
      } else if (subject.length === 1) {
        formattedData[formattedData.length - 1].code = subject[0].code;
        formattedData[formattedData.length - 1].color = subject[0].color
          ? subject[0].color
          : "blue";
      } else {
        formattedData[formattedData.length - 1].code = "";
        formattedData[formattedData.length - 1].color = "";
      }
    });
  });

  return { formattedData, conflicts };
}

function chooseColor(
  data: { [key: string]: string | string[] } | undefined
): string {
  const { theme } = useTheme();
  const { onFocusSubject } = useContext(onFocusSubjectContext);

  if (!data) return "";

  if (theme === "light") {
    if (!(data.code === onFocusSubject.code)) {
      return data.color[0];
    } else {
      return 'bg-gray-300 border-2 border-black';
    }
  } else {
    if (!(data.code === onFocusSubject.code)) {
      return data.color[1];
    } else {
      return 'bg-gray-600 border-2 border-white';
    }
  }
}

export default function WeekCalendarComponent(data: { data: SubjectsType[] }) {
  const { formattedData, conflicts } = formatSubjectsToTableData(data.data);

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
                          formattedData.find(
                            (data) => data.time === time && data.day === day
                          )
                        ) +
                        " " +
                        "w-full flex justify-center items-center h-6 rounded-sm"
                      }
                    >
                      <div className="text-center font-medium">
                        {formattedData.find(
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
