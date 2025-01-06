import { createRootRoute, Outlet } from "@tanstack/react-router";
import { BaseLayout } from "@/layouts/base-layout";

export const Route = createRootRoute({
  component: () => (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  ),
});
