import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import OrderModal from "@/components/OrderModal";
import ToastStack from "@/components/ToastStack";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useToastQueue } from "@/hooks/useToastQueue";
import { sendOrderEmail } from "@/lib/emailjs";
import { Product } from "@/types/product";

export default function Index() {
  const { products, loading } = useProducts();
  const { placeOrder } = useOrders();
  const { toasts, showToast } = useToastQueue();

  const [activeCategory, setActiveCategory] = useState("all");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleSave = useCallback(
    (product: Product) => {
      setSavedItems((prev) => {
        const next = new Set(prev);
        if (next.has(product.id)) {
          next.delete(product.id);
          showToast("Removed from saved items", "unbookmark", "−");
        } else {
          next.add(product.id);
          showToast(`<strong>${product.name}</strong> bookmarked`, "bookmark", "✓");
        }
        return next;
      });
    },
    [showToast]
  );

  const handleOrderSubmit = useCallback(
    async (data: { name: string; phone: string; email: string }) => {
      if (!data.name || !data.phone || !data.email) {
        showToast("Please fill in all fields", "unbookmark", "!");
        return;
      }
      if (!orderProduct) return;

      await placeOrder({
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        timestamp: Date.now(),
      });

      sendOrderEmail({
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
      });

      setOrderProduct(null);
      showToast(
        `Order placed for <strong>${orderProduct.name}</strong> — we'll be in touch!`,
        "order",
        "✓"
      );
    },
    [orderProduct, placeOrder, showToast]
  );

  return (
    <div className="min-h-screen bg-background">
      <ToastStack toasts={toasts} />
      <Header savedCount={savedItems.size} />
      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

      {loading ? (
        <div className="text-center text-muted py-16 text-sm">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-16 text-sm">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 px-7 pt-1 pb-10">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSaved={savedItems.has(p.id)}
              onSave={() => handleSave(p)}
              onOrder={() => setOrderProduct(p)}
            />
          ))}
        </div>
      )}

      {orderProduct && (
        <OrderModal
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}
