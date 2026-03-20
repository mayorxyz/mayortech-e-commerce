import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product, Order } from "@/types/product";
import { useToastQueue, ToastType } from "@/hooks/useToastQueue";

interface OrderRecord extends Order {
  placedAt: string;
}

interface StoreContextType {
  savedItems: Set<string>;
  savedProducts: Product[];
  orderHistory: OrderRecord[];
  toasts: ReturnType<typeof useToastQueue>["toasts"];
  showToast: (message: string, type?: ToastType, icon?: string) => void;
  toggleSave: (product: Product) => void;
  removeSaved: (productId: string) => void;
  addOrderToHistory: (order: Order, product: Product) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toasts, showToast } = useToastQueue();
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("mayortech-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("mayortech-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleSave = useCallback(
    (product: Product) => {
      setSavedItems((prev) => {
        const next = new Set(prev);
        if (next.has(product.id)) {
          next.delete(product.id);
          setSavedProducts((sp) => sp.filter((p) => p.id !== product.id));
          showToast("Removed from saved items", "unbookmark", "−");
        } else {
          next.add(product.id);
          setSavedProducts((sp) => [...sp, product]);
          showToast(`<strong>${product.name}</strong> bookmarked`, "bookmark", "✓");
        }
        return next;
      });
    },
    [showToast]
  );

  const removeSaved = useCallback((productId: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    setSavedProducts((sp) => sp.filter((p) => p.id !== productId));
  }, []);

  const addOrderToHistory = useCallback((order: Order, product: Product) => {
    setOrderHistory((prev) => [
      {
        ...order,
        placedAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        savedItems,
        savedProducts,
        orderHistory,
        toasts,
        showToast,
        toggleSave,
        removeSaved,
        addOrderToHistory,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
