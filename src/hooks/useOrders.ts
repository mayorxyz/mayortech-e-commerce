import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface OrderItem {
  productName: string;
  price: string;
  quantity: number;
  image?: string;
}

export interface OrderInput {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  status?: string;
}

export interface LocalOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  createdAt: number;
}

const ORDERS_STORAGE_KEY = "user_orders";

export function useOrders() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveToLocalStorage = (order: LocalOrder) => {
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
      const updated = [order, ...existing.filter((o: LocalOrder) => o.id !== order.id)];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to save order to localStorage:", err);
    }
  };

  const getFromLocalStorage = (): LocalOrder[] => {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    } catch (err) {
      console.warn("Failed to load orders from localStorage:", err);
      return [];
    }
  };

  const placeOrder = async (
    order: OrderInput
  ): Promise<{ success: boolean; error?: string; orderId?: string }> => {
    setIsSubmitting(true);

    // Create optimistic local order
    const optimisticOrder: LocalOrder = {
      id: `temp_${Date.now()}`,
      orderId: `ORD${Date.now()}`,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerAddress: order.customer_address,
      items: order.items,
      totalAmount: order.total_amount,
      orderStatus: "confirmed",
      createdAt: Date.now(),
    };

    // Save optimistically to localStorage immediately
    saveToLocalStorage(optimisticOrder);

    try {
      // Firestore save
      const firestoreData = {
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        items: order.items,
        totalAmount: order.total_amount,
        orderStatus: "confirmed" as const,
        createdAt: serverTimestamp(),
      };

      let realOrderId = optimisticOrder.id;
      try {
        const docRef = await Promise.race([
          addDoc(collection(db, "order_tracking"), firestoreData),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 8000)),
        ]);
        realOrderId = docRef.id;
      } catch (fbErr) {
        console.warn("Firebase save failed/timed out, order saved locally:", fbErr);
      }

      // Update localStorage with real ID
      const updatedOrder = { ...optimisticOrder, id: realOrderId, orderId: realOrderId };
      saveToLocalStorage(updatedOrder);

      // Supabase save (fire-and-forget)
      supabase.from("orders").insert({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        items: order.items,
        total_amount: order.total_amount,
        status: "confirmed",
      }).then(({ error }) => {
        if (error) console.warn("Supabase insert warning:", error.message);
      });

      return { success: true, orderId: realOrderId };
    } catch (err: any) {
      console.error("Order error:", err);
      // Remove failed order from localStorage
      try {
        const existing = getFromLocalStorage();
        const filtered = existing.filter(o => o.id !== optimisticOrder.id);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
      } catch {}
      return { success: false, error: err.message || "Something went wrong" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { placeOrder, isSubmitting, getFromLocalStorage, saveToLocalStorage };
}
