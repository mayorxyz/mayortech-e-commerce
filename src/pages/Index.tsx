import { useState, useCallback, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import PriceFilter from "@/components/PriceFilter";
import ProductCard from "@/components/ProductCard";
import OrderModal from "@/components/OrderModal";
import ToastStack from "@/components/ToastStack";
import DeliveryExpander from "@/components/DeliveryExpander";
import OrderProcessExpander from "@/components/OrderProcessExpander";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AboutSheet from "@/components/AboutSheet";
import ContactSheet from "@/components/ContactSheet";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useOrders } from "@/hooks/useOrders";
import { useStore } from "@/contexts/StoreContext";
import { sendOrderEmail } from "@/lib/emailjs";
import { Product } from "@/types/product";

function useColumns() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 4 : w >= 640 ? 3 : 2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function MasonryGrid({ items, cartItems, addToCart, setOrderProduct }: {
  items: Product[];
  cartItems: Record<string, { product: Product; quantity: number }>;
  addToCart: (p: Product) => void;
  setOrderProduct: (p: Product) => void;
}) {
  const cols = useColumns();
  const columns: Product[][] = Array.from({ length: cols }, () => []);
  items.forEach((p, i) => columns[i % cols].push(p));
  return (
    <div className="grid-columns">
      {columns.map((col, ci) => (
        <div className="grid-col" key={ci}>
          {col.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inCart={!!cartItems[p.id]}
              onAddToCart={() => addToCart(p)}
              onOrder={() => setOrderProduct(p)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const { products } = useSupabaseProducts();
  const { placeOrder } = useOrders();
  const { cartItems, toasts, showToast, addToCart, addOrderToHistory } = useStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000000);
  const [sortValue, setSortValue] = useState("newest");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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

    if (sortValue === "asc") result = [...result].sort((a, b) => a.priceNum - b.priceNum);
    else if (sortValue === "desc") result = [...result].sort((a, b) => b.priceNum - a.priceNum);
    else if (sortValue === "az") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, activeCategory, searchQuery, priceMin, priceMax, sortValue]);

  const handleOrderSubmit = useCallback(
    async (data: { name: string; phone: string; email: string; address: string }): Promise<boolean> => {
      if (!data.name || !data.phone || !data.email || !data.address) {
        showToast("Please fill in all fields", "unbookmark", "!");
        return false;
      }
      if (!orderProduct) return false;

      const result = await placeOrder({
        customer_name: data.name,
        customer_phone: data.phone,
        customer_address: data.address,
        items: [{ productName: orderProduct.name, price: orderProduct.price, quantity: 1 }],
        total_amount: orderProduct.priceNum,
        status: "pending",
      });

      if (!result.success) {
        showToast(result.error || "Failed to place order", "unbookmark", "!");
        return false;
      }

      addOrderToHistory({
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
        status: "pending",
        timestamp: Date.now(),
      }, orderProduct);

      sendOrderEmail({
        productName: orderProduct.name,
        customerName: data.name,
        phone: data.phone,
        email: data.email,
      });

      showToast(
        `Order placed for <strong>${orderProduct.name}</strong> — we'll be in touch!`,
        "order",
        "✓"
      );
      return true;
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
      <Header onAbout={() => setAboutOpen(true)} onContact={() => setContactOpen(true)} />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <PriceFilter
        priceMin={priceMin}
        priceMax={priceMax}
        onPriceChange={handlePriceChange}
        sortValue={sortValue}
        onSortChange={setSortValue}
      />

      <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

      <div className="why">
        <div className="why-i"><span>✓</span> Genuine products</div>
        <div className="why-i"><span>✓</span> Fast delivery</div>
        <div className="why-i"><span>✓</span> WhatsApp support</div>
      </div>

      {filtered.length === 0 ? (
        <div className="grid-columns">
          <div className="empty" style={{ width: "100%" }}>
            <span className="emo">{searchQuery.trim() ? "🔍" : "📦"}</span>
            <p>
              {searchQuery.trim()
                ? <>No results for "<strong>{searchQuery}</strong>"</>
                : "Nothing here yet — check back soon"}
            </p>
          </div>
        </div>
      ) : (
        <MasonryGrid items={filtered} cartItems={cartItems} addToCart={addToCart} setOrderProduct={setOrderProduct} />
      )}

      <OrderProcessExpander />
      <DeliveryExpander />
      <Footer />
      <WhatsAppFloat />
      <AboutSheet open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ContactSheet open={contactOpen} onClose={() => setContactOpen(false)} />

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
