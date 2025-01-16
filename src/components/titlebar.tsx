import { getCurrentWindow } from "@tauri-apps/api/window";

import { Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export const Titlebar = () => {
  const [isMaximized, setMaximized] = useState(false);
  useEffect(() => {
    const initialMaximized = async () => {
      const state = await getCurrentWindow().isMaximized();
      setMaximized(state);
    };
    initialMaximized();
  }, []);

  const close = () => {
    getCurrentWindow().close();
  };

  const minimize = () => {
    getCurrentWindow().minimize();
  };

  const toggleMaximize = async () => {
    await getCurrentWindow().toggleMaximize();
    setMaximized((current) => !current);
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
          <MinusIcon />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => toggleMaximize()}>
          {isMaximized ? <Minimize2Icon /> : <Maximize2Icon />}
        </Button>

        <Button variant="ghost" size="icon" onClick={() => close()}>
          <XIcon />
        </Button>
      </div>
    </div>
  );
};
