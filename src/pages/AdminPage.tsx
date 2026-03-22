import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";

const ADMIN_PASSWORD = "mayortech2024";

const categoryOptions = ["phones", "laptops", "earphones", "powerbanks", "accessories", "others"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const { products, deleteProduct, addProduct } = useProducts();
  const { orders } = useOrders();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("phones");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [specs, setSpecs] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="bg-surface border border-border rounded-[20px] p-7 w-full max-w-sm">
          <h1 className="font-heading font-bold text-xl mb-4">Admin Login</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter password"
            onKeyDown={(e) => e.key === "Enter" && pw === ADMIN_PASSWORD && setAuthed(true)}
            className="w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted mb-3"
          />
          <button
            onClick={() => pw === ADMIN_PASSWORD && setAuthed(true)}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!name || !price || !desc || !specs) return;
    setUploading(true);

    let imageUrl = "";
    if (imageFile) {
      try {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snap = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snap.ref);
      } catch {
        imageUrl = "";
      }
    }

    await addProduct({ name, category, price, priceNum: parseInt(price.replace(/\D/g, "")) || 0, condition: "new" as const, inStock: true, desc, specs, image: imageUrl, images: imageUrl ? [imageUrl] : [] });
    setName("");
    setPrice("");
    setDesc("");
    setSpecs("");
    setImageFile(null);
    setUploading(false);
  };

  const inputClass =
    "w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted";

  return (
    <div className="min-h-screen bg-background p-7 max-w-4xl mx-auto">
      <h1 className="font-heading font-extrabold text-2xl mb-6">
        Mayor<span className="text-primary">Tech</span> Admin
      </h1>

      {/* Add Product */}
      <section className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h2 className="font-heading font-bold text-base mb-4">Add New Product</h2>
        <div className="grid gap-3">
          <input className={inputClass} placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Price (e.g. ₦285,000)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <textarea className={`${inputClass} resize-none h-20`} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input className={inputClass} placeholder="Specs" value={specs} onChange={(e) => setSpecs(e.target.value)} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground file:cursor-pointer"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </div>
      </section>

      {/* Products List */}
      <section className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h2 className="font-heading font-bold text-base mb-4">Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-surface2 p-3 rounded-lg">
              <div>
                <span className="font-heading font-semibold text-sm">{p.name}</span>
                <span className="text-muted text-xs ml-2">{p.price}</span>
              </div>
              <button
                onClick={() => deleteProduct(p.id)}
                className="text-xs text-destructive hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Orders */}
      <section className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-heading font-bold text-base mb-4">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-muted text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-surface2 p-3 rounded-lg text-sm">
                <div className="font-heading font-semibold">{o.productName}</div>
                <div className="text-muted mt-1">
                  {o.customerName} · {o.phone} · {o.email}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
