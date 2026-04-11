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

export function useOrders() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeOrder = async (
    order: OrderInput
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      const firestoreData = {
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        items: order.items,
        totalAmount: order.total_amount,
        orderStatus: "confirmed" as const,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "order_tracking"), firestoreData);

      const { error } = await supabase.from("orders").insert({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        items: order.items,
        total_amount: order.total_amount,
        status: "confirmed",
      });
      if (error) {
        console.warn("Supabase insert warning:", error.message);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Order error:", err);
      return { success: false, error: err.message || "Something went wrong" };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { placeOrder, isSubmitting };
}
