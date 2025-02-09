import { LibraryFilesQueryOptions } from "@/api/library";
import { AddPodcastButton } from "@/components/podcast/add-podcast-button";
import { PodcastTable } from "@/components/podcast/podcast-table";
import { RefetchButton } from "@/components/refetch-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(LibraryFilesQueryOptions);
  },
  component: Library,
});

function Library() {
  const filesQuery = useQuery(LibraryFilesQueryOptions);
  const { data: files, isFetching, refetch, dataUpdatedAt } = filesQuery;
  if (files) {
    console.log({ files });
  }
  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="w-full flex justify-between">
        <p className="font-semibold text-xl">Library</p>
        <div className="flex gap-4">
          <AddPodcastButton />
          <RefetchButton
            refetch={refetch}
            isFetching={isFetching}
            lastFetched={dataUpdatedAt}
          />
        </div>
      </div>
      {files ? (
        <PodcastTable data={files} />
      ) : (
        <Skeleton className="w-full h-12" />
      )}
    </div>
  );
}
