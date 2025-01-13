import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export const AddPodcastButton = () => {
  return (
    <Button variant="outline" asChild>
      <Link to="/add">Add Podcast</Link>
    </Button>
  );
};
