import { db } from "@/db/db";
import { filesSchema } from "@/db/schema";
import { queryOptions } from "@tanstack/react-query";

export const LibraryFiles = async () => {
    return db
        .select()
        .from(filesSchema)
}

export const LibraryFilesQueryOptions = queryOptions({
    queryKey: ["library-files"],
    queryFn: () => LibraryFiles(),
});