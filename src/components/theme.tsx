import { flushSync } from "react-dom";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { atom, useAtom } from "jotai";

type Theme = "dark" | "light";

const themeAtom = atom<Theme>("dark");

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    console.log(`going ${next}`);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    setTheme(next);
  };

  return { theme, toggleTheme };
};

export const ThemeToggle = () => {
  const { toggleTheme } = useTheme();
  const toggle = async () => {
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    }).ready;

    window.document.documentElement.animate(
      {
        clipPath: [`inset(0 0 0 100%)`, `inset(0 0 0 0)`],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <Button
      variant="ghost"
      aria-label="Toggle colorscheme"
      onClick={() => toggle()}
      size="icon"
    >
      <SunIcon className="absolute rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 delay-100" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 delay-100" />
    </Button>
  );
};
