export interface Product {
  id: string;
  category: string;
  name: string;
  price: string;
  priceNum: number;
  condition: "new" | "uk" | "ng";
  inStock: boolean;
  image: string;
  images: string[];
  desc: string;
  specs: string;
  video_url?: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  video_url: string | null;
  in_stock: boolean;
  created_at: string;
}

export interface Order {
  id?: string;
  productId?: string;
  productName: string;
  customerName: string;
  phone: string;
  email: string;
  status?: string;
  timestamp: number;
}
