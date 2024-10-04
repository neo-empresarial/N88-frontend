import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { list } from "postcss";

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

function formatSubjectsToTableData(subjects: SubjectsType[]): object{
  const formattedData: { [key: string]: string }[] = [];
  const conflicts: { [key: string]: string | string[] }[] = [];

  timeSlots.forEach((time) => {
    weekDays.forEach((day) => {
      if (day === "") return;

      formattedData.push({
        time: time,
        day: day,
        code: "",
        color: ""
      })

      const subject = subjects.filter((subject) => {
        return subject.schedules.find((schedule) => {
          const class_start_time = timeSlots.findIndex((t) => t === schedule.starttime);
          const class_end_time = class_start_time + schedule.classesnumber - 1;
          return (
            getDayIndex(day) === Number(schedule.weekday) &&
            timeSlots.indexOf(time) >= class_start_time &&
            timeSlots.indexOf(time) <= class_end_time
          );
        });
      });

      if (subject.length > 1) {
        conflicts.push({
          subjects: subject.map((s) => s.code),
          time: time
        })
        formattedData[formattedData.length - 1].code = subject[-1].code;
        formattedData[formattedData.length - 1].color = "red";
      } else if (subject.length === 1) {
        formattedData[formattedData.length - 1].code = subject[0].code;
        formattedData[formattedData.length - 1].color = subject[0].color ? subject[0].color : "blue";
      } else {
        formattedData[formattedData.length - 1].code = "";
        formattedData[formattedData.length - 1].color = "";
      }
    })
  })

  return {formattedData, conflicts};
}

export default function WeekCalendarComponent(data: { data: SubjectsType[] }) {
  const { formattedData, conflicts } = formatSubjectsToTableData(data.data);

  // console.log(formattedData);

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
          {timeSlots.map((slot) => (
            <TableRow key={slot}>
              {weekDays.map((day) =>
                day === "" ? (
                  <TableCell key={`${day}-${slot}`} className="w-24">
                    <div className="w-full text-center h-6 align-middle font-medium text-muted-foreground">
                      {slot}
                    </div>
                  </TableCell>
                ) : (
                  <TableCell key={`${day}-${slot}`} className="w-24">
                    {data.data.map((subject, index) => {
                      const schedule = subject.schedules.find((schedule) => {
                        return (
                          getDayIndex(day) === Number(schedule.weekday) &&
                          schedule.starttime === slot
                        );
                      });

                      // Return JSX based on whether a schedule was found or not
                      return schedule ? (
                        <div key={index} className="h-7 w-30">
                          <Card className={`rounded-sm h-full w-full ${subject.color}`}>
                            <CardContent>
                              <div className="h-full text-center">
                                <span>{subject.code}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div key={index} className="h-7 w-30"></div>
                      );
                    })}
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
