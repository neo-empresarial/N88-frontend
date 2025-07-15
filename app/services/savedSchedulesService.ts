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
    console.log("🔍 [FRONTEND] handleApiError - Response not ok");
    console.log("🔍 [FRONTEND] handleApiError - Status:", response.status);
    console.log(
      "🔍 [FRONTEND] handleApiError - Status text:",
      response.statusText
    );

    const errorData = await response.json().catch(() => ({}));
    console.log("🔍 [FRONTEND] handleApiError - Error data:", errorData);

    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Helper function to get the backend URL with fallback
const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
};

export const useSavedSchedules = () => {
  const getSavedSchedules = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${getBackendUrl()}saved-schedules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleApiError(response);
  };

  const createSavedSchedule = async (data: CreateSavedScheduleDto) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${getBackendUrl()}saved-schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const updateSavedSchedule = async (
    id: number,
    data: CreateSavedScheduleDto
  ) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const deleteSavedSchedule = async (id: number) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete saved schedule");
    }
  };

  const testJwt = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(`${getBackendUrl()}auth/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  };

  return {
    getSavedSchedules,
    createSavedSchedule,
    updateSavedSchedule,
    deleteSavedSchedule,
    testJwt,
  };
};
