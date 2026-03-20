import { ShoppingCart } from "lucide-react";

interface Props {
  savedCount: number;
}

export default function Header({ savedCount }: Props) {
  return (
    <header
      className="flex items-center justify-between px-7 pt-5 pb-4 border-b border-border sticky top-0 z-[100] backdrop-blur-[12px]"
      style={{ background: "rgba(14,14,15,0.92)" }}
    >
      <div className="font-heading font-extrabold text-xl tracking-tight">
        Mayor<span className="text-primary">Tech</span>
      </div>
      <button className="flex items-center gap-2 bg-surface2 border border-border text-foreground font-body text-[13px] py-2 px-3.5 rounded-full transition-all hover:bg-surface hover:border-[rgba(255,255,255,0.15)]">
        <ShoppingCart size={14} />
        Saved
        <div className="bg-primary text-primary-foreground font-bold text-[11px] w-[18px] h-[18px] rounded-full flex items-center justify-center transition-transform">
          {savedCount}
        </div>
      </button>
    </header>
  );
}
