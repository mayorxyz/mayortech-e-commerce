import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1", category: "phones", name: "iPhone 15 Pro Max", price: "₦1,350,000", priceNum: 1350000, condition: "Brand New", inStock: true, sold: false, brand: "", tagline: "", specifications: {},
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
    ],
    desc: "The iPhone 15 Pro Max is Apple's most powerful iPhone ever. Featuring the groundbreaking A17 Pro chip built on 3nm technology, a stunning 6.7\" Super Retina XDR display with ProMotion, and a professional-grade 48MP main camera with 5x optical zoom. Built with a lightweight titanium frame that's both stronger and lighter than steel.",
    specs: "Display:6.7\" OLED ProMotion|Chip:A17 Pro (3nm)|Camera:48MP + 12MP + 12MP|Battery:4422mAh|Storage:256GB / 512GB / 1TB|OS:iOS 17|Connectivity:5G + WiFi 6E",
  },
  {
    id: "2", category: "phones", name: "Samsung Galaxy S24 Ultra", price: "₦1,180,000", priceNum: 1180000, condition: "Brand New", inStock: true, sold: false, brand: "", tagline: "", specifications: {},
    image: "https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-s928-sm-s928bzkgbtu-thumb-539566655",
    images: ["https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-s928-sm-s928bzkgbtu-thumb-539566655"],
    desc: "The Galaxy S24 Ultra redefines what a smartphone can do. Powered by the Snapdragon 8 Gen 3, it features a jaw-dropping 200MP quad-camera system, a built-in S Pen for precision input, and a massive 5000mAh battery. The titanium frame gives it a premium feel that matches its performance.",
    specs: "Display:6.8\" AMOLED 2X 120Hz|Chip:Snapdragon 8 Gen 3|Camera:200MP + 50MP + 12MP + 10MP|Battery:5000mAh|Storage:256GB / 512GB|OS:Android 14|S Pen:Built-in",
  },
  {
    id: "3", category: "phones", name: "iPhone 13 (UK Used)", price: "₦480,000", priceNum: 480000, condition: "UK Used", inStock: true, sold: false, brand: "", tagline: "", specifications: {},
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572386470",
    images: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=940&hei=1112&fmt=png-alpha&.v=1645572386470"],
    desc: "A premium UK-used iPhone 13 in excellent condition. The A15 Bionic chip still runs everything smoothly, and the dual camera system produces stunning photos. Comes with original accessories and is fully unlocked for all networks.",
    specs: "Display:6.1\" Super Retina XDR|Chip:A15 Bionic|Camera:12MP + 12MP Dual|Battery:3227mAh|Storage:128GB|OS:iOS 16 (upgradeable)|Condition:UK Used — Grade A",
  },
  {
    id: "4", category: "laptops", name: "MacBook Air M3", price: "₦1,620,000", priceNum: 1620000, condition: "new", inStock: true,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665",
    images: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"],
    desc: "The MacBook Air M3 is the perfect everyday laptop — incredibly thin, completely fanless, and absolutely silent. The M3 chip delivers performance that rivals many pro machines, while the gorgeous 13.6\" Liquid Retina display and up to 18 hours of battery life make it ideal for students and professionals alike.",
    specs: "Display:13.6\" Liquid Retina|Chip:Apple M3 (8-core)|RAM:8GB unified memory|Storage:256GB SSD|Battery:Up to 18 hours|OS:macOS Sonoma|Weight:1.24 kg",
  },
  {
    id: "5", category: "laptops", name: "Dell XPS 15", price: "₦1,490,000", priceNum: 1490000, condition: "new", inStock: false,
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100,1&resMode=sharp2&size=4000,3000&chrss=full",
    images: ["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100,1&resMode=sharp2&size=4000,3000&chrss=full"],
    desc: "The Dell XPS 15 is a powerhouse for creators and power users. The 15.6\" OLED display with 3.5K resolution makes every image breathtaking, while the NVIDIA RTX 4060 handles video editing and gaming with ease.",
    specs: "Display:15.6\" OLED 3.5K|CPU:Intel Core i7-13700H|GPU:NVIDIA RTX 4060 8GB|RAM:16GB DDR5|Storage:512GB NVMe SSD|OS:Windows 11 Home|Weight:1.86 kg",
  },
  {
    id: "6", category: "earphones", name: "AirPods Pro 2", price: "₦285,000", priceNum: 285000, condition: "new", inStock: true,
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
    images: ["https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361"],
    desc: "AirPods Pro 2nd generation deliver the most immersive sound Apple has ever made, with up to 2x more Active Noise Cancellation than the previous generation. The USB-C MagSafe case extends total battery life to 30 hours.",
    specs: "Driver:Custom Apple H2|ANC:2nd gen Active Noise Cancellation|Battery:6hr + 24hr case|Case:USB-C + MagSafe|Rating:IP54 water resistant|Fit:XS / S / M / L ear tips",
  },
  {
    id: "7", category: "powerbanks", name: "Anker 733 GaNPrime", price: "₦68,000", priceNum: 68000, condition: "new", inStock: true,
    image: "https://m.media-amazon.com/images/I/61bnMLM93jL._AC_SX679_.jpg",
    images: ["https://m.media-amazon.com/images/I/61bnMLM93jL._AC_SX679_.jpg"],
    desc: "The Anker 733 is both a power bank and a wall charger in one. GaN technology allows it to charge a laptop, a phone, and another device simultaneously. The built-in USB-C cable means you never have to carry an extra cable.",
    specs: "Capacity:10,000mAh|Max output:65W|Built-in cable:USB-C|Ports:2x USB-C + 1x USB-A|Wall plug:Built-in foldable|Technology:GaNPrime|Weight:227g",
  },
  {
    id: "8", category: "phones", name: "Tecno Camon 30 Pro", price: "₦185,000", priceNum: 185000, condition: "new", inStock: true,
    image: "https://fdn2.gsmarena.com/vv/pics/tecno/tecno-camon-30-pro-5g-1.jpg",
    images: ["https://fdn2.gsmarena.com/vv/pics/tecno/tecno-camon-30-pro-5g-1.jpg"],
    desc: "The Tecno Camon 30 Pro offers flagship features at an accessible price. 50MP triple camera with AI, 5G connectivity and a 5000mAh battery — handles everything Nigerian daily life demands.",
    specs: "Display:6.67\" AMOLED 144Hz|Chip:Dimensity 8200|Camera:50MP + 50MP + 13MP|Battery:5000mAh 45W|Storage:256GB|OS:Android 14|Network:5G",
  },
];
