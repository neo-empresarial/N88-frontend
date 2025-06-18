import { getSession } from "@/lib/session";

export interface SharedSchedule {
  id: number;
  scheduleId: number;
  sharedByUserId: number;
  sharedByUserName: string;
  sharedWithUserId: number;
  groupId: number;
  groupName: string;
  sharedAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
  originalSchedule: {
    title: string;
    description: string;
    items: {
      subjectCode: string;
      classCode: string;
      activated: boolean;
    }[];
  };
}

export interface ShareScheduleDto {
  scheduleId: number;
  groupId: number;
  userIds?: number[];
}

export interface AcceptSharedScheduleDto {
  sharedScheduleId: number;
}

// Helper function to construct URLs without double slashes
const buildUrl = (endpoint: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
};

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

export const useSharedSchedules = () => {
  const shareSchedule = async (data: ShareScheduleDto) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(buildUrl("shared-schedules/share"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const getReceivedSharedSchedules = async () => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(buildUrl("shared-schedules/received"), {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    });

    return handleApiError(response);
  };

  const getSentSharedSchedules = async () => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(buildUrl("shared-schedules/sent"), {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    });

    return handleApiError(response);
  };

  const acceptSharedSchedule = async (data: AcceptSharedScheduleDto) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(buildUrl("shared-schedules/accept"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return handleApiError(response);
  };

  const declineSharedSchedule = async (id: number) => {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No access token found");
    }

    const response = await fetch(buildUrl(`shared-schedules/${id}/decline`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to decline shared schedule");
    }
  };

  return {
    shareSchedule,
    getReceivedSharedSchedules,
    getSentSharedSchedules,
    acceptSharedSchedule,
    declineSharedSchedule,
  };
};
