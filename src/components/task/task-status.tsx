import { CheckIcon, LoaderIcon } from "lucide-react";
import { Badge } from "../ui/badge";

export const TaskStatus: React.FC<{ status: string }> = ({ status }) => {
  const isDone = status === "completed";
  return (
    <Badge variant={isDone ? "success" : "default"}>
      <div className="flex gap-0.5">
        {isDone ? (
          <CheckIcon size={18} />
        ) : (
          <LoaderIcon
            size={18}
            className="animate-spin [animation-duration:2s]"
          />
        )}
        <p className="capitalize">{status}</p>
      </div>
    </Badge>
  );
};
