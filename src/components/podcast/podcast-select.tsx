import { usePodcastStore } from "@/store/podcast";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { SelectPodcastButton } from "./select-podcast-button";

export const PodcastSelect = () => {
  const navigate = useNavigate();
  const updatePath = usePodcastStore.use.updatePath();

  const onSelect = async (filePath: string | null) => {
    if (!filePath) return;

    updatePath(filePath);
    navigate({ to: "/add" });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex gap-2 flex-col items-center">
        <p className="font-semibold text-lg">Select a podcast to get started</p>
        <SelectPodcastButton onSelect={onSelect} />
      </div>

      <Button variant={"link"} asChild>
        <Link to="/library">Or pick one from your library</Link>
      </Button>
    </div>
  );
};
