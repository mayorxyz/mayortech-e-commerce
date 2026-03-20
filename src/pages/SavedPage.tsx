import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function SavedPage() {
  const [tab, setTab] = useState<"bookmarked" | "orders">("bookmarked");
  const { savedProducts, removeSaved, orderHistory } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-7 pt-5 pb-4 border-b border-border sticky top-0 z-[100] backdrop-blur-[12px] bg-background/90">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-muted hover:text-foreground text-sm font-body transition-colors cursor-pointer mb-3"
        >
          <ArrowLeft size={15} />
          Back to store
        </button>
        <h1 className="font-heading font-extrabold text-xl">Saved Items</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-7 pt-4 pb-2">
        {(["bookmarked", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-[9px] px-[18px] rounded-full text-[13px] font-medium cursor-pointer border transition-all capitalize
              ${
                tab === t
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "border-border bg-surface text-muted hover:text-foreground hover:border-[rgba(255,255,255,0.2)]"
              }
            `}
          >
            {t === "bookmarked" ? "Bookmarked" : "Orders"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-7 pt-3 pb-10">
        {tab === "bookmarked" ? (
          savedProducts.length === 0 ? (
            <div className="text-center text-muted py-16 text-sm">
              Nothing bookmarked yet. Hit <span className="text-primary font-semibold">+</span> on any product to save it.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="w-full aspect-square bg-surface2 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-3/4 h-3/4 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.3";
                      }}
                    />
                  </div>
                  <div className="p-3.5 flex-1">
                    <div className="font-heading font-semibold text-sm leading-tight text-foreground">
                      {p.name}
                    </div>
                    <div className="text-[13px] font-medium text-primary mt-1">{p.price}</div>
                  </div>
                  <div className="px-3.5 pb-3.5">
                    <button
                      onClick={() => removeSaved(p.id)}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-destructive transition-colors cursor-pointer"
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : orderHistory.length === 0 ? (
          <div className="text-center text-muted py-16 text-sm">No orders yet.</div>
        ) : (
          <div className="space-y-3">
            {orderHistory.map((o, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-4">
                <div className="font-heading font-semibold text-sm text-foreground">
                  {o.productName}
                </div>
                <div className="text-xs text-muted mt-1.5">
                  {o.customerName} · {o.phone}
                </div>
                <div className="text-xs text-muted mt-0.5">{o.placedAt}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
