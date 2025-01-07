import { prettifyDate, relativeDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export const RelativeDate: React.FC<{ date: string }> = ({ date }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span>{relativeDate(date)}</span>
        </TooltipTrigger>
        <TooltipContent>{prettifyDate(date)}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
