import { FileIcon } from "lucide-react";
import { Button } from "./ui/button";
import { open } from "@tauri-apps/plugin-dialog";

export const FileButton: React.FC<{
  onSelect: (filePath: string | null) => void;
}> = ({ onSelect }) => {
  const select = async () => {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Audio",
          extensions: [
            "mp3",
            "awb",
            "ogg",
            "wma",
            "m4a",
            "aac",
            "amr",
            "oga",
            "wav",
          ],
        },
      ],
      title: "Select Podcast File",
    });
    onSelect(file);
  };

  return (
    <Button onClick={() => select()}>
      <FileIcon /> Select Podcast
    </Button>
  );
};
