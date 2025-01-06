import { getCurrentWindow } from "@tauri-apps/api/window";

import { Minimize2Icon, SidebarClose, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme";
import { SidebarTrigger } from "./ui/sidebar";

export const Titlebar = () => {
  const close = () => {
    getCurrentWindow().close();
  };

  const minimize = () => {
    getCurrentWindow().minimize();
  };

  return (
    <div
      data-tauri-drag-region
      className="bg-accent text-accent-foreground w-full h-8 flex items-center py-1"
    >
      <div className="flex-1 flex items-center" data-tauri-drag-region>
        <SidebarTrigger />
      </div>
      <div className="flex text-sm">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={() => minimize()}>
          <Minimize2Icon />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => close()}>
          <XIcon />
        </Button>
      </div>
    </div>
  );
};
