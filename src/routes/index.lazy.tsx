import { FileButton } from "@/components/file-button";
import { Button } from "@/components/ui/button";
import { SpeechToText } from "@/sdk/file";
import { createLazyFileRoute } from "@tanstack/react-router";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { atom, useAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const filePathAtom = atom("");

const useFile = () => {
  const [filePath, setFilePath] = useAtom(filePathAtom);
  const [file, setFile] = useState<Uint8Array | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  const loadFile = async (filePath: string) => {
    console.log(`reading ${filePath}`);
    setFilePath(filePath);
    setLoaded(false);

    const fileData = await readFile(filePath);
    setFile(fileData);
  };

  useEffect(() => {
    setLoaded(!!file);
  }, [file]);

  return {
    filePath,
    file,
    isLoaded,
    loadFile,
  };
};

function Index() {
  return (
    <div className="w-full h-full flex">
      <div className="w-2/5 max-w-lg h-full rounded-rb-xl bg-accent p-8">
        <FileSide />
      </div>
    </div>
  );
}

const FileSide = () => {
  const { file, filePath, loadFile, isLoaded } = useFile();

  const onSelect = async (filePath: string | null) => {
    if (!filePath) return;
    await loadFile(filePath);
  };

  if (!filePath) {
    return (
      <div className="flex gap-2 flex-col items-center">
        <p className="font-semibold">Select your podcast to get started</p>
        <FileButton onSelect={onSelect} />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="flex items-center gap-2 justify-center">
        <LoaderIcon
          size={18}
          className="animate-spin [animation-duration:2s]"
        />
        Loading file...
        {isLoaded}
      </div>
    );
  }

  const speechToText = async () => {
    const res = await SpeechToText(file);
    console.log({ res });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-mono">loaded {filePath}</p>
      <Button onClick={() => speechToText()}>Queue Speech to Text</Button>
    </div>
  );
};
