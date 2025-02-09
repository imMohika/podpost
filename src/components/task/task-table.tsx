import { shorten } from "@/lib/utils";
import type { TTaskStatus, TTaskType } from "@/sdk/task";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, InfoIcon } from "lucide-react";
import { CopyButton } from "../copy-button";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableProvider,
  DataTableToggleFilter,
} from "../data-table";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { TaskDeleteButton } from "./task-delete-button";
import { TaskStatus } from "./task-status";
import { TaskType } from "./task-type";

const taskTypes = [
  {
    value: "full_process",
    label: "Full Process",
  },
  {
    value: "transcription",
    label: "Transcription",
  },
] satisfies Array<{
  value: TTaskType;
  label: string;
}>;

const columns: ColumnDef<TTaskStatus>[] = [
  {
    accessorKey: "identifier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifier" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const identifier = String(row.getValue("identifier"));
      return (
        <div className="font-medium">
          {shorten(identifier)}
          <CopyButton value={identifier} />
        </div>
      );
    },
  },
  {
    accessorKey: "task_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = String(row.getValue("task_type"));
      return <TaskType type={type} />;
    },
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = String(row.getValue("status"));
      return <TaskStatus status={status} />;
    },
    filterFn: "equalsString",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const identifier = String(row.getValue("identifier"));
      return (
        <div className="flex gap-2 justify-self-end">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link to="/tasks/$identifier" params={{ identifier }}>
              <InfoIcon />
            </Link>
          </Button>

          <TaskDeleteButton identifier={identifier} type="icon" />
        </div>
      );
    },
  },
];

export const TaskTable: React.FC<{ data: TTaskStatus[] }> = ({ data }) => {
  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center py-4 gap-2">
          <p className="text-sm font-semibold">Filters:</p>
          <DataTableToggleFilter columnId="status" want="completed">
            <CheckIcon />
            Completed
          </DataTableToggleFilter>
          <Separator orientation="vertical" className="self-stretch h-auto" />
          <DataTableFacetedFilter
            columnId="task_type"
            title="Type"
            options={taskTypes}
          />
        </div>
        <DataTable />
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};
