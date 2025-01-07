import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { BaseLayout } from "@/layouts/base-layout";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  ),
  notFoundComponent: () => {
    return (
      <div>
        <p>Nothing here</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});
