import { getSession } from "@/lib/session";
import { scheduleSubjectsType } from "../schedule/providers/subjectsContext";

export interface SavedSchedule {
  idsavedschedule: number;
  title: string;
  description: string;
  items: {
    subjectCode: string;
    classCode: string;
    activated: boolean;
  }[];
}

export interface CreateSavedScheduleDto {
  title: string;
  description: string;
  items: {
    subjectCode: string;
    classCode: string;
    activated: boolean;
  }[];
}

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

export const useSavedSchedules = () => {
  const getSavedSchedules = async () => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}saved-schedules`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include", // This will send the cookies
    });

    return handleApiError(response);
  };

  const createSavedSchedule = async (data: CreateSavedScheduleDto) => {

    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}saved-schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include", // This will send the cookies
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const updateSavedSchedule = async (
    id: number,
    data: CreateSavedScheduleDto
  ) => {

    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DATABASE_URL}saved-schedules/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include", // This will send the cookies
        body: JSON.stringify(data),
      }
    );

    return handleApiError(response);
  };

  const deleteSavedSchedule = async (id: number) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DATABASE_URL}saved-schedules/${id}`,
      {
        method: "DELETE",
        credentials: "include", // This will send the cookies
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete saved schedule");
    }
  };

  return {
    getSavedSchedules,
    createSavedSchedule,
    updateSavedSchedule,
    deleteSavedSchedule,
  };
};
