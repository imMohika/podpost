import { CopyButton } from "@/components/copy-button";
import { RelativeDate } from "@/components/relative-date";
import { TaskDeleteButton } from "@/components/task-delete-button";
import { TaskStatus } from "@/components/task-status";
import { TaskType } from "@/components/task-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { shorten } from "@/lib/utils";
import {
  ResultSegment,
  TaskInfo as TTaskInfo,
  TaskInfoQueryOptions,
} from "@/sdk/task";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronsUpDownIcon,
  CircleXIcon,
  TextIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/tasks/$identifier")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(TaskInfoQueryOptions(params.identifier));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { identifier } = Route.useParams();
  const navigate = useNavigate();
  const infoQuery = useQuery(TaskInfoQueryOptions(identifier));
  const { data: info } = infoQuery;
  return (
    <div className="p-4 flex flex-col gap-2 h-full w-full">
      <div>
        <Button variant={"outline"}>
          <ArrowLeftIcon />
          <Link to="/tasks">Tasks</Link>
        </Button>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <div className="text-xl font-semibold">
            Task{" "}
            <code className="font-mono text-base">{shorten(identifier)}</code>
            <CopyButton value={identifier} />
          </div>
          {info ? (
            <TaskStatus status={info.status} />
          ) : (
            <Skeleton className="w-full h-6" />
          )}
        </div>

        <TaskDeleteButton
          identifier={identifier}
          after={() => {
            navigate({ to: "/tasks" });
          }}
        />
      </div>

      {info ? <TaskInfo info={info} /> : <Skeleton className="w-full h-12" />}
    </div>
  );
}

const TaskInfo: React.FC<{ info: TTaskInfo }> = ({ info }) => {
  if (info.error) {
    return (
      <Alert>
        <CircleXIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{info.error}</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="p-4 flex flex-col gap-4 flex-auto min-h-0">
      <TaskMetadata metadata={info.metadata} />
      {info.result && (
        <div className="flex flex-col flex-auto min-h-0">
          <ScrollArea className="w-full h-full rounded-md border">
            <TaskResult result={info.result} />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const TaskResult: React.FC<{ result: TTaskInfo["result"] }> = ({ result }) => {
  if (!result) {
    return (
      <div className="w-full max-w-xl space-y-2 rounded-md border px-4 py-2  shadow-sm">
        <h4 className="font-semibold">Result</h4>
        <p className="text-center font-semibold">No result</p>
      </div>
    );
  }
  const groupedSegments = result.segments.reduce<
    Record<string, ResultSegment[]>
  >((acc, segment) => {
    const speakerKey = segment.speaker ?? "Unknown";
    if (!acc[speakerKey]) {
      acc[speakerKey] = [];
    }
    acc[speakerKey].push(segment);
    return acc;
  }, {});

  return (
    <div className="w-full space-y-2 rounded-md border px-4 py-2 shadow-sm">
      <h4 className="font-semibold">Result</h4>
      {Object.entries(groupedSegments).map(([speaker, segments]) => (
        <div
          className="flex flex-col w-full rounded-md border p-2 shadow-sm gap-1"
          key={speaker}
        >
          <div className="flex gap-2">
            <TextIcon size={18} />
            <div className="font-bold text-sm">{speaker}</div>
          </div>
          {segments.map((segment) => (
            <div
              className="flex w-full rounded-md border p-2 shadow-sm gap-1"
              key={`${segment.start}-${segment.end}`}
            >
              <div className="flex gap-2 items-center">
                <p className="text-xs flex gap-1 items-center">
                  {segment.start} <ArrowRightIcon size={18} /> {segment.end}
                </p>
              </div>
              <p className="pl-2 flex">{segment.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const TaskMetadata: React.FC<{ metadata: TTaskInfo["metadata"] }> = ({
  metadata,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-fit mx-auto space-y-2 rounded-md border px-4 py-2  shadow-sm whitespace-nowrap"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="font-semibold">Metadata</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDownIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="flex gap-3 w-full justify-between">
        <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center">
          <p className="font-semibold">Task Type:</p>
          <Badge>
            <TaskType type={metadata.task_type} />
          </Badge>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center">
          <p className="font-semibold">Language:</p>
          <Badge>{metadata.language}</Badge>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center">
          <p className="font-semibold">Audio Duration:</p>
          <Badge>{metadata.audio_duration}s</Badge>
        </div>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
          <div className="flex gap-1 items-center">
            <p className="font-semibold">Start time</p>
            <Badge>
              <RelativeDate date={metadata.start_time} />
            </Badge>
          </div>
          <div className="flex gap-1 items-center">
            <p className="font-semibold">End time</p>
            <Badge>
              <RelativeDate date={metadata.end_time} />
            </Badge>
          </div>
          <div className="flex gap-1 items-center">
            <p className="font-semibold">Duration</p>
            <Badge>{metadata.duration}s</Badge>
          </div>
        </div>

        <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
          {metadata.file_name && (
            <div className="flex gap-1 items-center">
              <p className="font-semibold">File name</p>
              <Badge>{metadata.file_name}</Badge>
            </div>
          )}
          {metadata.url && (
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Url</p>
              <Badge>{metadata.url}</Badge>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
