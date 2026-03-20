import { Product } from "@/types/product";

// Sample products used when Firebase is not configured
export const sampleProducts: Product[] = [
  {
    id: "1",
    category: "phones",
    name: "iPhone 15 Pro Max",
    price: "₦1,350,000",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
    desc: "6.7\" Super Retina XDR display, A17 Pro chip, 48MP camera system, USB-C, Titanium frame. Available in Natural, Blue, White, and Black Titanium.",
    specs: "256GB / 512GB | iOS 17 | 5G Ready",
  },
  {
    id: "2",
    category: "phones",
    name: "Samsung Galaxy S24 Ultra",
    price: "₦1,180,000",
    image: "https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-s928-sm-s928bzkgbtu-thumb-539566655",
    desc: "6.8\" Dynamic AMOLED 2X, Snapdragon 8 Gen 3, 200MP quad-camera, built-in S Pen, 5000mAh battery.",
    specs: "256GB | Android 14 | Titanium Black",
  },
  {
    id: "3",
    category: "laptops",
    name: "MacBook Air M3",
    price: "₦1,620,000",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665",
    desc: "13.6\" Liquid Retina display, Apple M3 chip, 8GB RAM, 256GB SSD, up to 18hrs battery. Fanless, silent operation.",
    specs: "8GB RAM | 256GB SSD | macOS Sonoma",
  },
  {
    id: "4",
    category: "laptops",
    name: "Dell XPS 15",
    price: "₦1,490,000",
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100,1&resMode=sharp2&size=4000,3000&chrss=full",
    desc: "15.6\" OLED 3.5K touch display, Intel Core i7-13700H, NVIDIA RTX 4060, premium CNC aluminum chassis.",
    specs: "16GB RAM | 512GB SSD | Windows 11",
  },
  {
    id: "5",
    category: "earphones",
    name: "AirPods Pro 2",
    price: "₦285,000",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
    desc: "Active Noise Cancellation, Adaptive Transparency, Personalised Spatial Audio, MagSafe charging case, IP54 rated.",
    specs: "30hr total battery | USB-C case | H2 chip",
  },
  {
    id: "6",
    category: "powerbanks",
    name: "Anker 733 Power Bank",
    price: "₦68,000",
    image: "https://m.media-amazon.com/images/I/61bnMLM93jL._AC_SX679_.jpg",
    desc: "10,000mAh GaNPrime power bank with built-in USB-C cable. Charges a laptop and two phones simultaneously.",
    specs: "65W output | 10,000mAh | Built-in cable",
  },
];
