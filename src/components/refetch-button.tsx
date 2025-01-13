import { RefreshCwIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { RelativeTime } from "./relative-time";

export const RefetchButton: React.FC<{
  refetch: Function;
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
