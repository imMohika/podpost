import { cn } from "@/lib/utils";
import { RefreshCwIcon } from "lucide-react";
import { RelativeTime } from "./relative-time";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const RefetchButton: React.FC<{
  refetch: () => void;
  isFetching: boolean;
  lastFetched: number;
}> = ({ refetch, isFetching, lastFetched }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className="group"
            onClick={() => refetch()}
          >
            <RefreshCwIcon
              className={cn("transition-all", isFetching ? "animate-spin" : "")}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Last fetched <RelativeTime timestamp={lastFetched} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
