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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Download, X, Loader2, Inbox, CheckCircle, Clock } from "lucide-react";
import { useSharedSchedulesQuery } from "@/app/hooks/useSharedSchedules";
import { SharedSchedule } from "@/app/services/sharedSchedulesService";

export default function ReceivedSharedSchedulesDialog() {
  const [open, setOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<SharedSchedule | null>(null);
  const [showDeclineAlert, setShowDeclineAlert] = useState(false);

  const {
    receivedSharedSchedules,
    isLoadingReceived,
    acceptSharedSchedule,
    declineSharedSchedule,
    isAccepting,
    isDeclining,
  } = useSharedSchedulesQuery();

  const handleAccept = (sharedSchedule: SharedSchedule) => {
    acceptSharedSchedule({
      sharedScheduleId: sharedSchedule.id,
    });
  };

  const handleDecline = (sharedSchedule: SharedSchedule) => {
    setSelectedSchedule(sharedSchedule);
    setShowDeclineAlert(true);
  };

  const confirmDecline = () => {
    if (selectedSchedule) {
      declineSharedSchedule(selectedSchedule.id);
      setShowDeclineAlert(false);
      setSelectedSchedule(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Inbox className="h-4 w-4" />
            Compartilhados comigo
            {receivedSharedSchedules && receivedSharedSchedules.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {
                  receivedSharedSchedules.filter(
                    (s: SharedSchedule) => !s.isAccepted
                  ).length
                }
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Grades compartilhadas</DialogTitle>
            <DialogDescription>
              Grades compartilhadas com você por outros usuários
            </DialogDescription>
          </DialogHeader>

          {isLoadingReceived ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !receivedSharedSchedules ||
            receivedSharedSchedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ainda não existem grades compartilhadas com você</p>
              <p className="text-sm">
                Quando alguém compartilhar uma grade de horários com você, ela irá aparecer aqui.
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Compartilhado por</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compartilhado no</TableHead>
                    <TableHead className="w-[150px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedSharedSchedules.map(
                    (sharedSchedule: SharedSchedule) => (
                      <TableRow key={sharedSchedule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {sharedSchedule.originalSchedule.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sharedSchedule.originalSchedule.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {sharedSchedule.originalSchedule.items.length}{" "}
                              matérias
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {sharedSchedule.sharedByUserName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {sharedSchedule.groupName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {sharedSchedule.isAccepted ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Accepted
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(sharedSchedule.sharedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {!sharedSchedule.isAccepted ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAccept(sharedSchedule)}
                                disabled={isAccepting}
                                className="h-8"
                              >
                                {isAccepting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDecline(sharedSchedule)}
                                disabled={isDeclining}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {sharedSchedule.acceptedAt && (
                                <div>
                                  Aceito pelo {" "}
                                  {formatDate(sharedSchedule.acceptedAt)}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeclineAlert} onOpenChange={setShowDeclineAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar grade compartilhada?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que você quer recusar essa grade compartilhada? Essa ação não pode ser desfeita.
              {selectedSchedule && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <div className="font-medium">
                    {selectedSchedule.originalSchedule.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Compartilhado por {selectedSchedule.sharedByUserName}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDecline}
              className="bg-destructive text-destructive-foreground"
            >
              Recusar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
