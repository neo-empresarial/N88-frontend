"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getSession } from "@/lib/session";
import { useEffect, useState } from "react";

interface Notification {
  id: number;
  type: string;
  status: string;
  sender: {
    iduser: number;
    name: string;
  };
  group: {
    id: number;
    name: string;
  };
  createdAt: string;
}

const NotificationsDropdown = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setUserId(Number(session.user.id));
      }
    };
    checkSession();
  }, []);

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      return data;
    },
    enabled: !!userId,
  });

  const respondMutation = useMutation({
    mutationFn: async ({
      notificationId,
      accept,
    }: {
      notificationId: number;
      accept: boolean;
    }) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `/api/notifications/${notificationId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accept }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to respond to invitation");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Invitation responded to successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to respond to invitation");
    },
  });

  const handleRespond = (notificationId: number, accept: boolean) => {
    respondMutation.mutate({ notificationId, accept });
  };

  const pendingNotifications = notifications?.filter(
    (n: Notification) => n.status === "PENDING"
  );

  const isResponding = (notificationId: number, accept: boolean) => {
    return (
      respondMutation.isPending &&
      respondMutation.variables?.notificationId === notificationId &&
      respondMutation.variables?.accept === accept
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingNotifications?.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {pendingNotifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="w-full"
          >
            Refresh Notifications
          </Button>
        </div>
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : pendingNotifications?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No new notifications
          </div>
        ) : (
          pendingNotifications?.map((notification: Notification) => (
            <div key={notification.id} className="p-4 border-b last:border-0">
              <div className="flex flex-col gap-2">
                <p className="text-sm">
                  <span className="font-medium">
                    {notification.sender.name}
                  </span>{" "}
                  invited you to join group{" "}
                  <span className="font-medium">{notification.group.name}</span>
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRespond(notification.id, true)}
                    disabled={
                      isResponding(notification.id, true) ||
                      isResponding(notification.id, false)
                    }
                  >
                    {isResponding(notification.id, true) ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Accepting...
                      </div>
                    ) : (
                      "Accept"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRespond(notification.id, false)}
                    disabled={
                      isResponding(notification.id, true) ||
                      isResponding(notification.id, false)
                    }
                  >
                    {isResponding(notification.id, false) ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Declining...
                      </div>
                    ) : (
                      "Decline"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
