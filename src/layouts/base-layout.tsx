import { PropsWithChildren } from "react";

import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "@/styles/tailwind.css";
import { Titlebar } from "@/components/titlebar";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={`w-screen h-screen flex bg-transparent text-foreground`}>
      <Sidebar />

      <div className="w-full h-screen flex flex-col gap-2">
        <Titlebar />
        <main className="w-full flex-auto flex flex-col min-h-0">
          <ScrollArea>{children}</ScrollArea>
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
      {/* <TailwindIndicator /> */}
    </div>
  );
};
