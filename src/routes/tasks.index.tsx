import { RelativeTime } from "@/components/relative-time";
import { TaskTable } from "@/components/task-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TaskAllQueryOptions } from "@/sdk/sdk";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCwIcon } from "lucide-react";

export const Route = createFileRoute("/tasks/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(TaskAllQueryOptions),
  component: TasksComponent,
});

function TasksComponent() {
  const tasksQuery = useSuspenseQuery(TaskAllQueryOptions);
  const { data: tasks, isFetching, refetch, dataUpdatedAt } = tasksQuery;
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="w-full flex justify-between">
        <p className="font-semibold text-xl">Task List</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                size={"icon"}
                className="group"
                onClick={() => refetch()}
              >
                <RefreshCwIcon
                  className={cn(
                    "transition-all",
                    isFetching ? "animate-spin" : ""
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Last fetched <RelativeTime timestamp={dataUpdatedAt} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {tasks ? <TaskTable data={tasks} /> : <Skeleton />}
    </div>
  );
}
