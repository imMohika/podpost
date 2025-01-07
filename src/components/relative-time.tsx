import { relativeTime } from "@/lib/utils";

export const RelativeTime: React.FC<{ timestamp: number }> = ({
  timestamp,
}) => {
  return <span>{relativeTime(timestamp)}</span>;
};
