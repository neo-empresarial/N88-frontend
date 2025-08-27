import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSavedSchedulesQuery } from "@/app/hooks/useSavedSchedules";
import { useSubjects } from "../providers/subjectsContext";
import { Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { SavedSchedule } from "@/app/services/savedSchedulesService";
import { useSavedSchedules } from "@/app/services/savedSchedulesService";

function QuickSaveButton() {
  const { scheduleSubjects, currentScheduleId } = useSubjects();
  const { updateSchedule, savedSchedules, isCreating } =
    useSavedSchedulesQuery();

  const handleQuickSave = () => {
    if (!currentScheduleId) {
      toast.info("No schedule is currently loaded");
      return;
    }

    const existingSchedule = savedSchedules?.find(
      (schedule: SavedSchedule) =>
        schedule.idsavedschedule === currentScheduleId
    );

    if (existingSchedule) {
      console.log("Updating existing schedule:", existingSchedule.title);
      updateSchedule({
        id: existingSchedule.idsavedschedule,
        title: existingSchedule.title,
        description: existingSchedule.description,
        scheduleSubjects: scheduleSubjects,
      });
    } else {
      toast.error("Could not find the current schedule");
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={handleQuickSave}
      disabled={isCreating || !currentScheduleId}
    >
      <Save className="h-4 w-4" />
      {isCreating ? "Saving..." : "Quick Save"}
    </Button>
  );
}

function CreateScheduleDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { scheduleSubjects } = useSubjects();
  const { createSchedule, savedSchedules, isCreating } =
    useSavedSchedulesQuery();

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the schedule");
      return;
    }

    if (scheduleSubjects.length === 0) {
      toast.error("Please add at least one subject to the schedule");
      return;
    }

    createSchedule({
      title: title.trim(),
      description: description.trim(),
      scheduleSubjects,
    });

    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Create a new schedule with a different title and description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter schedule title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              maxLength={100}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter schedule description (optional)"
            />
            
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? "Saving..." : "Create Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TestJwtButton() {
  const { testJwt } = useSavedSchedules();

  const handleTest = async () => {
    try {
      const result = await testJwt();
      toast.success("JWT test successful!");
      console.log("JWT test result:", result);
    } catch (error) {
      toast.error("JWT test failed!");
      console.error("JWT test error:", error);
    }
  };

  return (
    <Button variant="outline" onClick={handleTest}>
      Test JWT
    </Button>
  );
}

export default function SaveScheduleDialog() {
  return (
    <div className="flex gap-2">
      <QuickSaveButton />
      <CreateScheduleDialog />
      <TestJwtButton />
    </div>
  );
}
