import type { TPodcast } from "@/db/schema";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { InfoIcon } from "lucide-react";
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableProvider,
} from "../data-table";
import { TaskDeleteButton } from "../task/task-delete-button";
import { Button } from "../ui/button";

const columns: ColumnDef<TPodcast>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const title = String(row.getValue("title"));
      return <div className="font-medium">{title}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const identifier = row.original.taskIdentifier;
      console.log({ identifier });
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

export const PodcastTable: React.FC<{ data: TPodcast[] }> = ({ data }) => {
  return (
    <DataTableProvider columns={columns} data={data}>
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center py-4 gap-2">
          <p className="text-sm font-semibold">Filters:</p>
        </div> */}
        <DataTable />
        <DataTablePagination />
      </div>
    </DataTableProvider>
  );
};
