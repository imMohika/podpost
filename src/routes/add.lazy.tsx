import { SelectPodcastButton } from "@/components/podcast/select-podcast-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { computePartialFileHash } from "@/lib/utils";
import { podcastStoreSelectors, usePodcastStore } from "@/store/podcast";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { readFile, copyFile, exists, mkdir } from "@tauri-apps/plugin-fs";
import { InfoIcon } from "lucide-react";
import { parseBuffer } from "music-metadata";
import { useEffect, useState } from "react";
import {
  appLocalDataDir,
  BaseDirectory,
  basename,
  resolve,
} from "@tauri-apps/api/path";
import { SpeechToText } from "@/sdk/file";
import { db } from "@/db/db";
import { filesSchema } from "@/db/schema";

export const Route = createLazyFileRoute("/add")({
  component: AddComponent,
});

function AddComponent() {
  const navigate = useNavigate();
  const path = podcastStoreSelectors.use.path();
  const fileData = podcastStoreSelectors.use.data();
  const fileHash = podcastStoreSelectors.use.hash();
  const updatePath = podcastStoreSelectors.use.updatePath();
  const updateData = podcastStoreSelectors.use.updateData();
  const updateHash = podcastStoreSelectors.use.updateHash();
  const updateMetadata = podcastStoreSelectors.use.updateMetadata();

  const loadFile = async (filePath: string) => {
    return readFile(filePath).then((data) => {
      updateData(data);
      return data;
    });
  };

  const hashFile = async (filePath: string, data: Uint8Array) => {
    return computePartialFileHash(filePath, data).then((hash) => {
      updateHash(hash);
      return hash;
    });
  };

  const readMetadata = async (filePath: string, data: Uint8Array) => {
    return parseBuffer(data, {
      path: filePath,
    }).then((metadata) => {
      updateMetadata(metadata);
      return metadata;
    });
  };

  const onSelect = async (filePath: string | null) => {
    if (!filePath) return;
    updatePath(filePath);
    loadFile(filePath).then(async (data) => {
      hashFile(filePath, data).then(() => {
        readMetadata(filePath, data);
      });
    });
  };

  const addPodcast = async () => {
    if (!path || path === "") return;
    if (!fileData) {
      await loadFile(path);
      if (!fileData) {
        console.error("file data is null after loadFile");
        return;
      }
    }

    if (!fileHash) {
      await hashFile(path, fileData);
      if (!fileHash) {
        console.error("file hash is null after hashFile");
        return;
      }
    }

    const fileName = await basename(path);
    const toPath = await resolve(await appLocalDataDir(), "library", fileName);

    const libraryExists = await exists("library", {
      baseDir: BaseDirectory.AppLocalData,
    });
    if (!libraryExists) {
      await mkdir("library", {
        baseDir: BaseDirectory.AppLocalData,
      });
    }
    console.log({ toPath, libraryExists });

    await copyFile(path, toPath);

    const { identifier } = await SpeechToText(fileData);

    await db.insert(filesSchema).values({
      filePath: toPath,
      fileHash: fileHash,
      taskIdentifier: identifier,
      // todo)) save metadata
    });

    navigate({
      to: "/tasks/$identifier",
      params: {
        identifier,
      },
    });
  };

  // initial file load
  useEffect(() => {
    if (!path || path === "") return;

    loadFile(path).then(async (data) => {
      hashFile(path, data).then(() => {
        readMetadata(path, data);
      });
    });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2 h-full min-h-0">
      <div className="w-full flex justify-between">
        <p className="font-semibold text-xl">Add Podcast</p>
      </div>

      <div className="flex w-full flex-1 gap-4">
        <div className="w-full h-full flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
            <p className="font-semibold">File</p>
            <SelectPodcastButton onSelect={onSelect} variant="combined" />
          </div>

          <p className="font-semibold">Metadata</p>
          <PodcastMetadata />
        </div>
        <div className="w-full h-full">
          <div className="justify-self-end">
            <Button onClick={() => addPodcast()}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PodcastMetadata = () => {
  const metadata = podcastStoreSelectors.use.metadata();
  const fileName = podcastStoreSelectors.use.fileName();

  const title = podcastStoreSelectors.use.title();
  const updateTitle = podcastStoreSelectors.use.updateTitle();

  useEffect(() => {
    console.log({ metadata });
    updateTitle(metadata?.common.title || fileName);
  }, [metadata, fileName]);

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">Title</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={14} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Title of podcast which be shown in library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!metadata ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              e.preventDefault();
              updateTitle(e.target.value);
            }}
          />
        )}
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">Comment</p>
        </div>
        {!metadata ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Textarea
            value={metadata.common.comment?.map((c) => c.text).join(" ")}
            onChange={(e) => {
              e.preventDefault();
              // updateTitle(e.target.value);
            }}
          />
        )}
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">Album</p>
        </div>
        {!metadata ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Input
            type="text"
            value={metadata.common.album}
            onChange={(e) => {
              e.preventDefault();
              // updateTitle(e.target.value);
            }}
          />
        )}
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
        <p className="font-semibold">Genre</p>
        {!metadata ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Input
            type="text"
            value={metadata.common.genre}
            onChange={(e) => {
              e.preventDefault();
              // updateTitle(e.target.value);
            }}
          />
        )}
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
        <p className="font-semibold">Year</p>
        {!metadata ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Input
            type="text"
            value={metadata.common.year}
            onChange={(e) => {
              e.preventDefault();
              // updateTitle(e.target.value);
            }}
          />
        )}
      </div>
    </div>
  );
};
