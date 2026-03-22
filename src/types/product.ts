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
