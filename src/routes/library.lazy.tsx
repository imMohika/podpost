import { db } from "@/db/db";
import { type Podcast, filesSchema } from "@/db/schema";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/library")({
  component: Library,
});

function Library() {
  const [files, setFiles] = useState<Array<Podcast> | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      await db
        .select()
        .from(filesSchema)
        .then((files) => {
          setFiles(files);
        });
    };
    loadFiles();
  }, []);

  if (!files) {
    return <div>Loading...</div>;
  }

  if (files.length === 0) {
    return <div>No files</div>;
  }

  return (
    <div>
      {files.map((file) => (
        <div key={file.fileHash}>
          <p>{file.filePath}</p>
        </div>
      ))}
    </div>
  );
}
