import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Product, SupabaseProduct } from "@/types/product";
import { products as hardcodedProducts } from "@/data/products";

function mapSupabaseProduct(p: SupabaseProduct): Product {
  const priceNum = p.price;
  const priceStr = "₦" + priceNum.toLocaleString("en-NG");
  return {
    id: p.id,
    name: p.name,
    price: priceStr,
    priceNum,
    category: p.category,
    condition: "new",
    inStock: p.in_stock,
    image: p.image_url || "",
    images: p.image_url ? [p.image_url] : [],
    desc: p.description || "",
    specs: "",
    video_url: p.video_url || undefined,
  };
}

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;

      if (data && data.length > 0) {
        setProducts(data.map(mapSupabaseProduct));
      } else {
        // Fallback to hardcoded if table is empty
        setProducts(hardcodedProducts);
      }
    } catch (e: any) {
      console.warn("Supabase products fetch failed, using hardcoded:", e.message);
      setProducts(hardcodedProducts);
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: {
    name: string;
    price: number;
    category: string;
    description: string;
    image_url: string;
    video_url?: string;
    in_stock: boolean;
  }) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProducts((prev) => [mapSupabaseProduct(data), ...prev]);
    }
    return data;
  };

  const updateProduct = async (id: string, updates: Partial<{
    name: string;
    price: number;
    category: string;
    description: string;
    image_url: string;
    video_url: string;
    in_stock: boolean;
  }>) => {
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadFile = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(path);

    return urlData.publicUrl;
  };

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, uploadFile };
}
