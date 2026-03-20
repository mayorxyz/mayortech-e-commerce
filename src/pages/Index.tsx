import { useState, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import OrderModal from "@/components/OrderModal";
import ToastStack from "@/components/ToastStack";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";
import { sendOrderEmail } from "@/lib/emailjs";
import { Product } from "@/types/product";

export default function Index() {
  const { products, loading } = useProducts();
  const { placeOrder } = useOrders();
  const { savedItems, toasts, showToast, toggleSave, addOrderToHistory } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, searchQuery]);

  const handleOrderSubmit = useCallback(
    async (data: { name: string; phone: string; email: string }) => {
      if (!data.name || !data.phone || !data.email) {
        showToast("Please fill in all fields", "unbookmark", "!");
        return;
      }
      if (!orderProduct) return;

      const orderData = {
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        timestamp: Date.now(),
      };

      await placeOrder(orderData);
      addOrderToHistory(orderData, orderProduct);

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
    [orderProduct, placeOrder, showToast, addOrderToHistory]
  );

  return (
    <div className="min-h-screen bg-background">
      <ToastStack toasts={toasts} />
      <Header />
      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {loading ? (
        <div className="text-center text-muted py-16 text-sm">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted py-16 text-sm">
          {searchQuery.trim()
            ? `No products found for '${searchQuery}'`
            : "No products in this category yet."}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5 px-7 pt-1 pb-10">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSaved={savedItems.has(p.id)}
              onSave={() => toggleSave(p)}
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
