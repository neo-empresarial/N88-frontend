"use client";

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

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  pendingCampusName: string | null;
};

export default function CampusChangeModal({ 
  open, 
  onConfirm, 
  onCancel, 
  pendingCampusName 
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar mudança de campus</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a mudar para o campus{" "}
            <strong>{pendingCampusName || "selecionado"}</strong>.
            <br />
            <br />
            Isso irá criar uma nova grade em branco. Todos os dados da grade atual serão perdidos, 
            exceto se ela estiver salva. Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
