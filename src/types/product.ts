export interface Product {
  id: string;
  category: string;
  name: string;
  price: string;
  image: string;
  desc: string;
  specs: string;
}

export interface Order {
  id?: string;
  productName: string;
  customerName: string;
  phone: string;
  email: string;
  timestamp: number;
}
