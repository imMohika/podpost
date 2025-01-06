import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/library")({
  component: Library,
});

function Library() {
  return <div>library</div>;
}
