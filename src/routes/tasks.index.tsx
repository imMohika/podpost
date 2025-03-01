import { AddPodcastButton } from "@/components/podcast/add-podcast-button";
import { RefetchButton } from "@/components/refetch-button";
import { TaskTable } from "@/components/task/task-table";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskAllQueryOptions } from "@/sdk/task";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(TaskAllQueryOptions);
  },
  component: TasksComponent,
});

function TasksComponent() {
  const tasksQuery = useQuery(TaskAllQueryOptions);
  const { data: tasks, isFetching, refetch, dataUpdatedAt } = tasksQuery;
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="w-full flex justify-between">
        <p className="font-semibold text-xl">Task List</p>
        <div className="flex gap-4">
          <AddPodcastButton />
          <RefetchButton
            refetch={refetch}
            isFetching={isFetching}
            lastFetched={dataUpdatedAt}
          />
        </div>
      </div>
      {tasks ? (
        <TaskTable data={tasks} />
      ) : (
        <Skeleton className="w-full h-12" />
      )}
    </div>
  );
}
