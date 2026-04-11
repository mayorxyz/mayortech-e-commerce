import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
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

export interface TrackedOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: string;
  orderStatus: OrderStatus;
  createdAt: number;
}

export function useOrderTracking(customerPhone?: string) {
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "order_tracking");
    let q;
    if (customerPhone) {
      q = query(col, where("customerPhone", "==", customerPhone));
    } else {
      q = query(col);
    }

    const unsub = onSnapshot(
      q,
      (snap) => {
        const results: TrackedOrder[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<TrackedOrder, "id">),
        }));
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

  const updateStatus = async (docId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, "order_tracking", docId), {
        orderStatus: newStatus,
      });
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return { orders, loading, updateStatus };
}

export function useAllOrderTracking() {
  return useOrderTracking();
}
