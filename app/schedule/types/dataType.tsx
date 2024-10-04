export type SchedulesType = {
  idschedule: number;
  weekday: string;
  starttime: string;
  classesnumber: number;
  building: string;
  room: string;
};

export type ProfessorsType = {
  idprofessor: number;
  name: string;
};

export type SubjectsType = {
  idsubject: number;
  code: string;
  classcode: string;
  name: string;
  totalvacancies: number;
  freevacancies: number;
  schedules: SchedulesType[];
  professors: ProfessorsType[];
  color?: string[];
};

export type DataType = {
  idsavedschedule: number;
  code: string;
  subjects: SubjectsType[];
};

export type TableType = {
  code: string;
  semester: string;
  name: string;
  color?: string;
}