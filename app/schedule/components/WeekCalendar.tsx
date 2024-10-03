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

export default function WeekCalendarComponent(data: { data: SubjectsType[] }) {
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
                        <Card key={index} className={`rounded-sm h-7 w-30 ${subject.color}`}>
                          <CardContent>
                            <div className="h-full text-center">
                              <span>{subject.code}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div key={index}></div>
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
