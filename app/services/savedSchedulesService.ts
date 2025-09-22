import { fetchWithAuth } from "@/lib/fetchWithAuth";

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


const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL;
};

export const useSavedSchedules = () => {
  const getSavedSchedules = async () => {
  const response = await fetchWithAuth(`${getBackendUrl()}saved-schedules`, {
    method: "GET",
    credentials: "include",
  });

  return response.json();
};

  const createSavedSchedule = async (data: CreateSavedScheduleDto) => {
    const response = await fetchWithAuth(`${getBackendUrl()}saved-schedules`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Falha em criar a grade");
    }
    return response.json();
  };

  const updateSavedSchedule = async (
    id: number,
    data: CreateSavedScheduleDto
  ) => {
    const response = await fetchWithAuth(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Falha em atualizar a grade");
    }
  };

  const deleteSavedSchedule = async (id: number) => {
    const response = await fetchWithAuth(`${getBackendUrl()}saved-schedules/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Falha em deletar a grade");
    }
    // window.location.reload(); perguntar para o guto sobre isso

  };


  return {  
    getSavedSchedules,
    createSavedSchedule,
    updateSavedSchedule,
    deleteSavedSchedule,
  };
};
