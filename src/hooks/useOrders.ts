import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/product";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    } catch {
      // Firebase not configured
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const placeOrder = async (order: Omit<Order, "id">) => {
    try {
      await addDoc(collection(db, "orders"), order);
    } catch {
      console.log("Order (local):", order);
    }
  };

  return { orders, placeOrder, refetch: fetchOrders };
}
