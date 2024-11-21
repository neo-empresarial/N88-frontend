"use client";

import { useState, useEffect } from "react";
import { useSubjects } from "../providers/subjectsContext";
import { scheduleSubjectsType } from "../providers/subjectsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { weekDays, timeSlots } from "../constants/week-times-and-days";
import { SubjectsType } from "../types/dataType";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";

export type tableDataType = {
  time: string;
  day: string;
  code: string[];
  colors: string[];
  now_color: string;
};

export default function WeekCalendarComponent() {
  const [tableData, setTableData] = useState<tableDataType[]>(
    generateTimesAndDays()
  );

  const {
    scheduleSubjects,
    searchedSubjects,
    onFocusSubject,
    onFocusSubjectClass,
  } = useSubjects();
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

  function getColorFromSubject(code: string) {
    const subject = searchedSubjects.find((subject) => subject.code === code);
    if (!subject) {
      return ["", ""];
    }
    return subject.color || ["", ""];
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
    const tableData: tableDataType[] = [];
    weekDays.forEach((day) => {
      timeSlots.forEach((time) => {
        if (day === "") return;
        tableData.push({
          time: time,
          day: day,
          code: [],
          colors: [],
          now_color: "",
        });
      });
    });
    return tableData;
  }

  function isOneOfTheSubjectsClassOnFocus(codes: string[]) {
    return codes.filter((code) => code === onFocusSubjectClass.code)[0];
  }

  function chooseColor(
    codes: string[],
    theme: string | undefined,
    onFocusSubject: { code: string }
  ): string {
    if (!codes.length) return "";

    let code = "";

    if (codes.length > 1) {
      const filtered_codes = codes.filter(
        (code) => code === onFocusSubjectClass.code
      );

      if (!filtered_codes.length) return "bg-red-500";

      code = filtered_codes[0];
    } else {
      code = codes[0];
    }

    if (theme === "light") {
      if (!(code === onFocusSubject?.code)) {
        return getColorFromSubject(code)[0];
      }
      return "bg-gray-300 border-2 border-black text-black";
    } else {
      if (!(code === onFocusSubject?.code)) {
        return getColorFromSubject(code)[1];
      }
      return "bg-gray-600 border-2 border-white text-white";
    }
  }

  function formatSubjectsToTableData(
    subjects: scheduleSubjectsType[],
    searchedSubjects: SubjectsType[]
  ): tableDataType[] {
    const tableData = generateTimesAndDays();

    if (subjects.length === 0) {
      console.log("No subjects found");
      return tableData;
    }

    subjects.forEach((subject) => {
      const classCode = subject.class;
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

          const colors = getColorFromSubject(subject.code);
          tableData[i].colors = colors;

          tableData[i].now_color = chooseColor(
            tableData[i].code,
            theme,
            onFocusSubject
          );
        }
      });
    });

    console.log({ tableData });

    return tableData;
  }

  const generateTooltipContent = (code: string[]) => {
    // Example: Matérias em conflito:
    // - DAS5120
    // - MTM3131

    const title = "Matérias em conflito:";

    // Get colors from code:
    const colors = code.map((c) => getColorFromSubject(c));

    return (
      <>
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          {code.map((c) => (
            <li className="font-semibold">
              <Badge
                variant="outline"
                className={`${chooseColor([c], theme, onFocusSubject)}`}
              >
                {" "}
                {c}
              </Badge>
            </li>
          ))}
        </ul>
      </>
    );
  };

  useEffect(() => {
    setTableData(formatSubjectsToTableData(scheduleSubjects, searchedSubjects));
  }, [scheduleSubjects, theme]);

  useEffect(() => {
    const copy_of_tableData = [...tableData];

    copy_of_tableData.map((data) => {
      data.now_color = chooseColor(data.code, theme, onFocusSubject);
    });

    return setTableData(copy_of_tableData);
  }, [onFocusSubject]);

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
          {timeSlots.map((time) => {
            return (
              <TableRow key={time}>
                {weekDays.map((day) => {
                  if (day === "") {
                    return (
                      <TableCell key={`${day}-${time}`} className="w-24">
                        <div className="w-full text-center h-6 font-medium text-muted-foreground">
                          {time}
                        </div>
                      </TableCell>
                    );
                  }

                  // Pre-filter data for the current time and day
                  const cellData = tableData.filter(
                    (data) => data.time === time && data.day === day
                  )[0];
                  const hasConflict = cellData.code.length > 1;
                  const codeToDisplay = isOneOfTheSubjectsClassOnFocus(
                    cellData.code
                  )
                    ? onFocusSubjectClass.code
                    : cellData.code[0];

                  return (
                    <TableCell key={`${day}-${time}`} className="w-24">
                      <div
                        className={`${
                          cellData?.now_color || ""
                        } w-full flex justify-center items-center h-6 rounded-sm`}
                      >
                        {hasConflict &&
                        !isOneOfTheSubjectsClassOnFocus(cellData.code) ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-pointer w-full h-full flex justify-center items-center text-center">
                                  Conflito
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {generateTooltipContent(cellData.code)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <div className="text-center font-medium">
                            {codeToDisplay || ""}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
