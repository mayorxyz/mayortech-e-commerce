import { ToastItem } from "@/hooks/useToastQueue";

interface Props {
  toasts: ToastItem[];
}

export default function ToastStack({ toasts }: Props) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => {
        const typeClass = t.type === "bookmark" ? "bm" : t.type === "order" || t.type === "cart" ? "ok" : t.type === "remove" ? "wn" : "ok";
        return (
          <div
            key={t.id}
            className={`toast-pill ${typeClass} ${t.phase === "in" ? "animate-toast-in" : "animate-toast-out"}`}
          >
            <div className="ti">{t.icon}</div>
            <span dangerouslySetInnerHTML={{ __html: t.message }} />
          </div>
        );
      })}
    </div>
  );
}
