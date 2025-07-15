"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Share2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/session";
import { useSharedSchedulesQuery } from "@/app/hooks/useSharedSchedules";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { toast } from "sonner";

interface ShareScheduleDialogProps {
  schedule: SavedSchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Group {
  id: number;
  name: string;
  description: string;
  members: {
    iduser: number;
    name: string;
    email: string;
  }[];
}

const buildUrl = (endpoint: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
};

export default function ShareScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: ShareScheduleDialogProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [shareWithAll, setShareWithAll] = useState(true);

  const { shareSchedule, isSharing } = useSharedSchedulesQuery();

  // Fetch user's groups
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(buildUrl("groups"), {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      return response.json();
    },
  });

  const selectedGroup = groups?.find(
    (group: Group) => group.id === selectedGroupId
  );

  const handleShare = async () => {
    if (!selectedGroupId) {
      toast.error("Please select a group");
      return;
    }

    try {
      await shareSchedule({
        scheduleId: schedule.idsavedschedule,
        groupId: selectedGroupId,
        userIds: shareWithAll ? undefined : selectedUserIds,
      });

      onOpenChange(false);
      setSelectedGroupId(null);
      setSelectedUserIds([]);
      setShareWithAll(true);
    } catch (error) {
      console.error("Error sharing schedule:", error);
    }
  };

  const handleUserToggle = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleShareWithAllToggle = (checked: boolean) => {
    setShareWithAll(checked);
    if (checked) {
      setSelectedUserIds([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Schedule</DialogTitle>
          <DialogDescription>
            Share "{schedule.title}" with members of your groups
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Group Selection */}
          <div className="space-y-2">
            <Label htmlFor="group">Select Group</Label>
            <Select
              value={selectedGroupId?.toString() || ""}
              onValueChange={(value) => setSelectedGroupId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a group" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGroups ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading groups...
                    </div>
                  </SelectItem>
                ) : groups?.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No groups available
                  </SelectItem>
                ) : (
                  groups?.map((group: Group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Share Options */}
          {selectedGroup && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shareWithAll"
                  checked={shareWithAll}
                  onCheckedChange={handleShareWithAllToggle}
                />
                <Label htmlFor="shareWithAll">
                  Share with all group members ({selectedGroup.members.length}{" "}
                  members)
                </Label>
              </div>

              {!shareWithAll && (
                <div className="space-y-2">
                  <Label>Select specific members:</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-3">
                    {selectedGroup.members.map(
                      (member: {
                        iduser: number;
                        name: string;
                        email: string;
                      }) => (
                        <div
                          key={member.iduser}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`user-${member.iduser}`}
                            checked={selectedUserIds.includes(member.iduser)}
                            onCheckedChange={() =>
                              handleUserToggle(member.iduser)
                            }
                          />
                          <Label
                            htmlFor={`user-${member.iduser}`}
                            className="text-sm"
                          >
                            {member.name} ({member.email})
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                  {selectedUserIds.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Please select at least one member
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={
                isSharing ||
                !selectedGroupId ||
                (!shareWithAll && selectedUserIds.length === 0)
              }
            >
              {isSharing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Schedule
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
