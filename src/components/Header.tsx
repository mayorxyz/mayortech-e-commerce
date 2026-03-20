import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import ThreeDotMenu from "./ThreeDotMenu";

export default function Header() {
  const { savedItems } = useStore();
  const navigate = useNavigate();

  return (
    <header
      className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-border sticky top-0 z-[100] backdrop-blur-[12px] bg-background/90"
    >
      <div
        className="font-heading font-extrabold text-xl tracking-tight cursor-pointer"
        onClick={() => navigate("/")}
      >
        Mayor<span className="text-primary">Tech</span>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate("/saved")}
          className="flex items-center gap-2 bg-surface2 border border-border text-foreground font-body text-[13px] py-2 px-3.5 rounded-full transition-all hover:bg-surface hover:border-[rgba(255,255,255,0.15)] cursor-pointer"
        >
          <ShoppingCart size={14} />
          Saved
          <div className="bg-primary text-primary-foreground font-bold text-[11px] w-[18px] h-[18px] rounded-full flex items-center justify-center transition-transform">
            {savedItems.size}
          </div>
        </button>
        <ThreeDotMenu />
      </div>
    </header>
  );
}
