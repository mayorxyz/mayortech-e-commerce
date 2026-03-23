import { useState, useCallback, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import PriceFilter from "@/components/PriceFilter";
import ProductCard from "@/components/ProductCard";
import OrderModal from "@/components/OrderModal";
import ToastStack from "@/components/ToastStack";
import TestimonialsSection from "@/components/TestimonialsSection";
import DeliveryExpander from "@/components/DeliveryExpander";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AboutSheet from "@/components/AboutSheet";
import { products } from "@/data/products";
import { useOrders } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";
import { sendOrderEmail } from "@/lib/emailjs";
import { Product } from "@/types/product";

export default function Index() {
  const { placeOrder } = useOrders();
  const { savedItems, toasts, showToast, toggleSave, addOrderToHistory } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000000);
  const [sortValue, setSortValue] = useState("newest");
  const [aboutOpen, setAboutOpen] = useState(false);

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

    result = result.filter((p) => p.priceNum >= priceMin && p.priceNum <= priceMax);

    // Sort
    if (sortValue === "asc") result = [...result].sort((a, b) => a.priceNum - b.priceNum);
    else if (sortValue === "desc") result = [...result].sort((a, b) => b.priceNum - a.priceNum);
    else if (sortValue === "az") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, activeCategory, searchQuery, priceMin, priceMax, sortValue]);

  const handleOrderSubmit = useCallback(
    async (data: { name: string; phone: string; email: string }) => {
      if (!data.name || !data.phone || !data.email) {
        showToast("Please fill in all fields", "unbookmark", "!");
        return;
      }
      if (!orderProduct) return;

      const orderData = {
        productId: orderProduct.id,
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        status: "pending",
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

  const handlePriceChange = useCallback((min: number, max: number) => {
    setPriceMin(min);
    setPriceMax(max);
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastStack toasts={toasts} />
      <Header onAbout={() => setAboutOpen(true)} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <PriceFilter
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceChange={handlePriceChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

      {/* Why strip */}
      <div className="why">
        <div className="why-i"><span>✓</span> Genuine products</div>
        <div className="why-i"><span>✓</span> Fast delivery</div>
        <div className="why-i"><span>✓</span> WhatsApp support</div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid">
          <div className="empty">
            <span className="emo">{searchQuery.trim() ? "🔍" : "📦"}</span>
            <p>
              {searchQuery.trim()
                ? <>No results for "<strong>{searchQuery}</strong>"</>
                : "Nothing here yet — check back soon"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid">
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

      <TestimonialsSection />
      <DeliveryExpander />
      <Footer />
      <WhatsAppFloat />
      <AboutSheet open={aboutOpen} onClose={() => setAboutOpen(false)} />

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
