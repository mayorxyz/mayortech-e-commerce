import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sampleProducts } from "@/lib/sampleProducts";
import { Product } from "@/types/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      if (snap.empty) {
        // Fallback to sample data if Firestore is empty or not configured
        setProducts(sampleProducts);
      } else {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      }
    } catch {
      // Firebase not configured, use sample data
      setProducts(sampleProducts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // If firebase not configured, just remove locally
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      const newProduct = { id: docRef.id, ...product };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch {
      // Fallback: add locally with random id
      const newProduct = { id: crypto.randomUUID(), ...product };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    }
  };

  return { products, loading, deleteProduct, addProduct, refetch: fetchProducts };
}
