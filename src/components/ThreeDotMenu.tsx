import { useState, useRef, useEffect } from "react";
import { MoreVertical, Sun, Moon } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function ThreeDotMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-full bg-surface2 border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-[rgba(255,255,255,0.15)] transition-all cursor-pointer"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] bg-surface border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[200px] py-1.5 z-[150] animate-slide-up">
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-surface2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <div
              className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                theme === "light" ? "bg-primary" : "bg-surface2 border border-border"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                  theme === "light"
                    ? "translate-x-[18px] bg-primary-foreground"
                    : "translate-x-0.5 bg-muted"
                }`}
              />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
