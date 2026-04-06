import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from "react";
import { Product, Order } from "@/types/product";
import { useToastQueue, ToastType } from "@/hooks/useToastQueue";

interface OrderRecord extends Order {
  placedAt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  cartItems: Record<string, CartItem>;
  cartCount: number;
  orderHistory: OrderRecord[];
  recentlyViewed: string[];
  toasts: ReturnType<typeof useToastQueue>["toasts"];
  showToast: (message: string, type?: ToastType, icon?: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  addOrderToHistory: (order: Order, product: Product) => void;
  addRecentlyViewed: (productId: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { toasts, showToast } = useToastQueue();
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("mt-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.body;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("mt-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setCartItems((prev) => {
        const next = { ...prev };
        const existing = next[product.id];
        if (existing) {
          next[product.id] = {
            product,
            quantity: Math.max(1, existing.quantity + quantity),
          };
        } else {
          next[product.id] = { product, quantity: Math.max(1, quantity) };
        }
        return next;
      });
      showToast("Added to cart", "cart", "✓");
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCartItems((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      showToast("Removed from cart", "remove", "−");
    },
    [showToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) => {
        if (!prev[productId]) return prev;
        return {
          ...prev,
          [productId]: {
            product: prev[productId].product,
            quantity,
          },
        };
      });
    },
    [removeFromCart]
  );

  const addOrderToHistory = useCallback((order: Order, _product: Product) => {
    setOrderHistory((prev) => [
      {
        ...order,
        placedAt: new Date().toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }),
      },
      ...prev,
    ]);
  }, []);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const next = prev.filter((x) => x !== productId);
      next.unshift(productId);
      if (next.length > 8) next.pop();
      return next;
    });
  }, []);

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        cartCount,
        orderHistory,
        recentlyViewed,
        toasts,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addOrderToHistory,
        addRecentlyViewed,
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
