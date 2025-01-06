import { PropsWithChildren } from "react";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "@/styles/tailwind.css";
import { Titlebar } from "@/components/titlebar";
import { Sidebar } from "@/components/sidebar";

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={`w-screen h-screen flex bg-background text-foreground`}>
      <Sidebar />

      <main className="w-full">
        <Titlebar />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        {/* <TailwindIndicator /> */}
      </main>
    </div>
  );
};
