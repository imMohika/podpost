import { SelectPodcastButton } from "@/components/podcast/select-podcast-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { db } from "@/db/db";
import { filesSchema } from "@/db/schema";
import { computePartialFileHash } from "@/lib/utils";
import { SpeechToText } from "@/sdk/file";
import { podcastStoreSelectors } from "@/store/podcast";
import { podcastMetadataStoreSelectors } from "@/store/podcast-metadata";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BaseDirectory,
  appLocalDataDir,
  basename,
  resolve,
} from "@tauri-apps/api/path";
import { copyFile, exists, mkdir, readFile } from "@tauri-apps/plugin-fs";
import { InfoIcon } from "lucide-react";
import { parseBuffer } from "music-metadata";
import { useCallback, useEffect, useState } from "react";

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

  const title = podcastMetadataStoreSelectors.use.title();
  const comment = podcastMetadataStoreSelectors.use.comment();
  const album = podcastMetadataStoreSelectors.use.album();
  const genre = podcastMetadataStoreSelectors.use.genre();
  const year = podcastMetadataStoreSelectors.use.year();

  const loadFile = useCallback(
    async (filePath: string) => {
      return readFile(filePath).then((data) => {
        updateData(data);
        return data;
      });
    },
    [updateData],
  );

  const hashFile = useCallback(
    async (filePath: string, data: Uint8Array) => {
      return computePartialFileHash(filePath, data).then((hash) => {
        updateHash(hash);
        return hash;
      });
    },
    [updateHash],
  );

  const onSelect = async (filePath: string | null) => {
    if (!filePath) return;
    updatePath(filePath);
    loadFile(filePath).then(async (data) => {
      hashFile(filePath, data);
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

    // todo)) check db for existing podcast

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

    const { identifier } = await SpeechToText(fileData);

    await db.insert(filesSchema).values({
      filePath: toPath,
      fileHash: fileHash,
      taskIdentifier: identifier,
      title,
      album,
      comment,
      genre,
      year,
    });

    await copyFile(path, toPath);

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
      hashFile(path, data);
    });
  }, [path, loadFile, hashFile]);

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
  const fileName = podcastStoreSelectors.use.fileName();
  const filePath = podcastStoreSelectors.use.path();
  const fileData = podcastStoreSelectors.use.data();

  const updateMetadata = podcastMetadataStoreSelectors.use.updateMetadata();

  const title = podcastMetadataStoreSelectors.use.title();
  const updateTitle = podcastMetadataStoreSelectors.use.updateTitle();

  const comment = podcastMetadataStoreSelectors.use.comment();
  const updateComment = podcastMetadataStoreSelectors.use.updateComment();

  const album = podcastMetadataStoreSelectors.use.album();
  const uptateAlbum = podcastMetadataStoreSelectors.use.updateAlbum();

  const genre = podcastMetadataStoreSelectors.use.genre();
  const updateGenre = podcastMetadataStoreSelectors.use.updateGenre();

  const year = podcastMetadataStoreSelectors.use.year();
  const updateYear = podcastMetadataStoreSelectors.use.updateYear();

  const [isReading, setReading] = useState(true);

  const loadMetadata = useCallback(async () => {
    if (!filePath || !fileData) return;
    setReading(true);

    const parsed = await parseBuffer(fileData, {
      path: filePath,
    });

    updateMetadata({
      title: parsed.common.title ?? fileName,
      comment: parsed.common.comment?.map((c) => c.text).join(" ") ?? "",
      album: parsed.common.album ?? "",
      genre: parsed.common.genre?.join(", ") ?? "",
      year: parsed.common.year?.toString() ?? "",
    });

    setReading(false);
  }, [filePath, fileData, fileName, updateMetadata]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

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
        <Input
          type="text"
          value={title}
          disabled={isReading}
          onChange={(e) => {
            e.preventDefault();
            updateTitle(e.target.value);
          }}
        />
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">Comment</p>
        </div>
        <Textarea
          disabled={isReading}
          value={comment}
          onChange={(e) => {
            e.preventDefault();
            updateComment(e.target.value);
          }}
        />
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 justify-center flex-col">
        <div className="flex items-center gap-1">
          <p className="font-semibold">Album</p>
        </div>
        <Input
          type="text"
          disabled={isReading}
          value={album}
          onChange={(e) => {
            e.preventDefault();
            uptateAlbum(e.target.value);
          }}
        />
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
        <p className="font-semibold">Genre</p>
        <Input
          type="text"
          disabled={isReading}
          value={genre}
          onChange={(e) => {
            e.preventDefault();
            updateGenre(e.target.value);
          }}
        />
      </div>

      <div className="rounded-md border px-4 py-2 text-sm shadow-sm flex gap-2 items-center justify-between">
        <p className="font-semibold">Year</p>
        <Input
          type="number"
          disabled={isReading}
          value={year}
          onChange={(e) => {
            e.preventDefault();
            updateYear(+e.target.value);
          }}
        />
      </div>
    </div>
  );
};
