export const TaskType: React.FC<{ type: string }> = ({ type }) => {
  return <p className="capitalize">{type.replace("_", " ")}</p>;
};
