import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TaskAllQueryOptions, TaskDelete } from "@/sdk/task";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";

export const TaskDeleteButton: React.FC<{
  identifier: string;
  type?: "icon" | "default";
  after?: () => void;
}> = ({ identifier, type = "default", after }) => {
  const queryClient = useQueryClient();

  const deleteTask = async () => {
    await TaskDelete(identifier);
    queryClient.invalidateQueries(TaskAllQueryOptions);

    if (after) {
      after();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          size={type === "icon" ? "icon" : "default"}
        >
          <TrashIcon />
          {type === "default" && "Delete"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={() => deleteTask()}>Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
