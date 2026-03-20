import { ToastItem } from "@/hooks/useToastQueue";

interface Props {
  toasts: ToastItem[];
}

export default function ToastStack({ toasts }: Props) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center gap-2 pointer-events-none w-max max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 py-[11px] px-[18px] rounded-full text-[13px] font-medium text-foreground whitespace-nowrap
            border backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.4)]
            ${t.phase === "in" ? "animate-toast-in" : "animate-toast-out"}
            ${t.type === "bookmark" ? "border-[rgba(232,255,71,0.2)]" : ""}
            ${t.type === "order" ? "border-[rgba(100,220,130,0.2)]" : ""}
            ${t.type === "unbookmark" ? "border-border" : ""}
          `}
          style={{ background: "rgba(26,26,28,0.95)" }}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
              ${t.type === "bookmark" ? "bg-[rgba(232,255,71,0.15)] text-primary" : ""}
              ${t.type === "order" ? "bg-[rgba(100,220,130,0.15)] text-[#64dc82]" : ""}
              ${t.type === "unbookmark" ? "bg-[rgba(255,255,255,0.08)] text-muted" : ""}
            `}
          >
            {t.icon}
          </div>
          <span dangerouslySetInnerHTML={{ __html: t.message }} />
        </div>
      ))}
    </div>
  );
}
