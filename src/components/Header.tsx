import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";

interface Props {
  onAbout: () => void;
}

export default function Header({ onAbout }: Props) {
  const { cartCount, theme, toggleTheme } = useStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="hdr">
      <div className="logo" onClick={() => navigate("/")}>Mayor<span>Tech</span></div>
      <div className="hdr-r">
        <div className="menu-wrap" ref={menuRef}>
          <button className="dots" onClick={() => setMenuOpen((o) => !o)}>⋮</button>
          <div className={`dd${menuOpen ? " open" : ""}`}>
            <div className="ddi" onClick={toggleTheme}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Light mode
              </div>
              <label className="tog" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={theme === "light"} onChange={toggleTheme} />
                <div className="tog-t" />
              </label>
            </div>
            <div className="ddi" onClick={() => { navigate("/saved"); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                My saved items
                <span style={{ marginLeft: 4, background: "var(--accent)", color: "#0e0e0f", borderRadius: 50, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{cartCount}</span>
              </div>
            </div>
            <div className="ddi" onClick={() => { onAbout(); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                About MayorTech
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
