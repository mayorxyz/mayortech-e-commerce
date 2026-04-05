import { useState } from "react";
import { supabase } from "@/lib/supabase";

export interface SupabaseOrder {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: { productName: string; price: string; quantity: number }[];
  total_amount: number;
  status: string;
}

export function useOrders() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeOrder = async (order: SupabaseOrder): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        items: order.items,
        total_amount: order.total_amount,
        status: order.status,
      });
      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, error: error.message };
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
