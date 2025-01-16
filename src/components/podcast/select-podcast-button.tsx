import { usePodcastStore } from "@/store/podcast";
import { basename } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const podcastTypes = [
  "mp3",
  "awb",
  "ogg",
  "wma",
  "m4a",
  "aac",
  "amr",
  "oga",
  "wav",
];

export const SelectPodcastButton: React.FC<{
  onSelect: (filePath: string | null) => void;
  variant?: "combined" | "default";
}> = ({ onSelect, variant = "default" }) => {
  const path = usePodcastStore.use.path();
  const [name, setName] = useState("");

  const select = async () => {
    const filePath = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Audio",
          extensions: podcastTypes,
        },
      ],
      title: "Select Podcast",
    });

    onSelect(filePath);
  };

  useEffect(() => {
    if (!path) return;
    basename(path).then((n) => setName(n));
  }, [path]);

  if (variant === "combined") {
    return (
      <Button
        variant="ghost"
        className="p-0 gap-0 w-full max-w-sm"
        onClick={() => select()}
      >
        <Input
          value={name}
          variant="outline"
          className="pointer-events-none border-r-0 rounded-r-none flex-1"
          disabled
        />
        <Button asChild size="icon">
          <div className="h-full">
            <FileIcon />
          </div>
        </Button>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className="p-0 gap-0 w-full max-w-sm h-min flex-col"
      onClick={() => select()}
    >
      <Input
        value={name}
        variant="outline"
        className="pointer-events-none rounded-b-none border-b-0"
        disabled
      />
      <Button asChild>
        <div className="flex items-center justify-center w-full">
          <FileIcon /> Select Podcast
        </div>
      </Button>
    </Button>
  );
};
