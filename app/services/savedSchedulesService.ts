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

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/";
};

export const useSavedSchedules = () => {
  const getSavedSchedules = async () => {
  const response = await fetch(`${getBackendUrl()}saved-schedules`, {
    method: "GET",
    credentials: "include",
  });

  return handleApiError(response);
};

  const createSavedSchedule = async (data: CreateSavedScheduleDto) => {
    const response = await fetch(`${getBackendUrl()}saved-schedules`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const updateSavedSchedule = async (
    id: number,
    data: CreateSavedScheduleDto
  ) => {
    const response = await fetch(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const deleteSavedSchedule = async (id: number) => {
    const response = await fetch(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

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
