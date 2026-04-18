import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";

interface Props {
  onAbout?: () => void;
  onContact?: () => void;
}

export default function Header({ onAbout, onContact }: Props) {
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
      <div className="logo" onClick={() => navigate("/")}>M<span> Gadgets</span></div>
      <div className="hdr-r">
        <button
          className="cart-icon-btn"
          onClick={() => navigate("/cart")}
          aria-label="Cart"
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--fg)",
            padding: 6,
            marginRight: 4,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "var(--accent)",
              color: "#0e0e0f",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}>{cartCount}</span>
          )}
        </button>
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
            <div className="ddi" onClick={() => { navigate("/services"); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
                Services
              </div>
            </div>
            <div className="ddi" onClick={() => { navigate("/cart"); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                </svg>
                My cart
                <span style={{ marginLeft: 4, background: "var(--accent)", color: "#0e0e0f", borderRadius: 50, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{cartCount}</span>
              </div>
            </div>
            <div className="ddi" onClick={() => { navigate("/contact"); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Contact Us
              </div>
            </div>
            <div className="ddi" onClick={() => { navigate("/about"); setMenuOpen(false); }}>
              <div className="ddi-l">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                About M Gadgets
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
