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

  useEffect(() => {
    const col = collection(db, "order_tracking");
    const q = customerPhone
      ? query(col, where("customerPhone", "==", customerPhone))
      : query(col);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const results: TrackedOrder[] = snap.docs.map((d) => {
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
        results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(results);
        setLoading(false);
      },
      (err) => {
        console.error("Order tracking listener error:", err);
        setLoading(false);
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
