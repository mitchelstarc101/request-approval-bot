
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import LeaveRequestForm from "@/components/LeaveRequestForm";

interface DashboardDialogsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  currentRequest: any;
  onEdit: (formData: any) => Promise<void>;
  onCreate: (formData: any) => Promise<void>;
  onDelete: () => Promise<void>;
}

const DashboardDialogs: React.FC<DashboardDialogsProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentRequest,
  onEdit,
  onCreate,
  onDelete
}) => {
  return (
    <>
      {/* Create/Edit Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentRequest ? "Edit Leave Request" : "New Leave Request"}
            </DialogTitle>
          </DialogHeader>
          
          <LeaveRequestForm
            initialData={currentRequest}
            onSubmit={currentRequest ? onEdit : onCreate}
            isEditing={!!currentRequest}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              leave request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DashboardDialogs;
