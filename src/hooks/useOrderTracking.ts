import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "packaging"
  | "out_for_delivery"
  | "delivered";

export const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packaging", label: "Packaging" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export interface OrderItem {
  productName: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface TrackedOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  totalAmount?: number;
  orderStatus: OrderStatus;
  createdAt: number;
}

const ORDERS_STORAGE_KEY = "user_orders";

export function useOrderTracking(customerPhone?: string) {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const updateStatus = useCallback(async (docId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, "order_tracking", docId), {
        orderStatus: newStatus,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }, []);

  // Load from localStorage first
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
        const filtered = customerPhone
          ? stored.filter((o: TrackedOrder) => o.customerPhone === customerPhone)
          : stored;
        filtered.sort((a: TrackedOrder, b: TrackedOrder) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(filtered);
        setLoading(false);
      } catch (err) {
        console.warn("Failed to load from localStorage:", err);
        setLoading(false);
      }
    };

    loadFromLocalStorage();
  }, [customerPhone]);

  // Then sync with Firebase
  useEffect(() => {
    const col = collection(db, "order_tracking");
    const q = customerPhone
      ? query(col, where("customerPhone", "==", customerPhone))
      : query(col);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const firebaseOrders: TrackedOrder[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            orderId: d.id,
            customerName: data.customerName || "Unknown",
            customerPhone: data.customerPhone || "",
            customerAddress: data.customerAddress || "",
            items: Array.isArray(data.items) ? data.items : [],
            totalAmount: data.totalAmount || 0,
            orderStatus: data.orderStatus || "confirmed",
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
          };
        });

        // Merge with localStorage data, preferring Firebase data
        setOrders((currentOrders) => {
          const merged = [...firebaseOrders];
          currentOrders.forEach((localOrder) => {
            if (!firebaseOrders.find((fb) => fb.id === localOrder.id)) {
              merged.push(localOrder);
            }
          });
          merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          // Update localStorage with merged data
          try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(merged));
          } catch (err) {
            console.warn("Failed to update localStorage:", err);
          }

          return merged;
        });
      },
      (err) => {
        console.error("Order tracking listener error:", err);
      }
    );

    return unsub;
  }, [customerPhone]);

  useEffect(() => {
    if (orders.length === 0) return;

    const checkAndAdvance = () => {
      const now = Date.now();
      orders.forEach((order) => {
        if (
          order.orderStatus === "confirmed" &&
          order.createdAt + 30 * 60 * 1000 <= now
        ) {
          updateStatus(order.id, "processing");
        }
      });
    };

    checkAndAdvance();
    const interval = window.setInterval(checkAndAdvance, 60 * 1000);
    return () => window.clearInterval(interval);
  }, [orders, updateStatus]);

  return { orders, loading, updateStatus };
}

export function useAllOrderTracking() {
  return useOrderTracking();
}
