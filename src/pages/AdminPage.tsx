import { useState } from "react";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORY_OPTIONS = ["phones", "laptops", "earphones", "powerbanks", "accessories", "others"];

export default function AdminPage() {
  const { products, loading, addProduct, updateProduct, deleteProduct, uploadFile } = useSupabaseProducts();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("phones");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const resetForm = () => {
    setName(""); setCategory("phones"); setPrice(""); setDescription("");
    setInStock(true); setImageFile(null); setVideoFile(null); setEditId(null);
  };

  const handleSubmit = async () => {
    if (!name || !price) { setMsg("Name and price are required"); return; }
    setUploading(true); setMsg("");
    try {
      let imageUrl = "";
      let videoUrl = "";
      if (imageFile) imageUrl = await uploadFile(imageFile, "images");
      if (videoFile) videoUrl = await uploadFile(videoFile, "videos");

      const priceNum = parseInt(price.replace(/\D/g, "")) || 0;

      if (editId) {
        const updates: any = { name, price: priceNum, category, description, in_stock: inStock };
        if (imageUrl) updates.image_url = imageUrl;
        if (videoUrl) updates.video_url = videoUrl;
        await updateProduct(editId, updates);
        setMsg("Product updated!");
      } else {
        await addProduct({
          name, price: priceNum, category, description,
          image_url: imageUrl, video_url: videoUrl || undefined, in_stock: inStock,
        });
        setMsg("Product added!");
      }
      resetForm();
    } catch (e: any) {
      setMsg("Error: " + e.message);
    }
    setUploading(false);
  };

  const handleEdit = (p: any) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.priceNum.toString());
    setCategory(p.category);
    setDescription(p.desc);
    setInStock(p.inStock);
    setImageFile(null);
    setVideoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setMsg("Product deleted");
    } catch (e: any) {
      setMsg("Error: " + e.message);
    }
  };

  const inputClass =
    "w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted";

  return (
    <div className="min-h-screen bg-background p-7 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading font-extrabold text-2xl">
          Mayor<span className="text-primary">Tech</span> Admin
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-heading font-bold text-sm cursor-pointer hover:brightness-90 border border-destructive/20"
        >
          Logout
        </button>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-surface2 border border-border text-sm text-foreground">
          {msg}
        </div>
      )}

      {/* Add/Edit Product */}
      <section className="bg-surface border border-border rounded-lg p-6 mb-8">
        <h2 className="font-heading font-bold text-base mb-4">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="grid gap-3">
          <input className={inputClass} placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className={inputClass} placeholder="Price (e.g. 285000)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <textarea
            className={`${inputClass} resize-none h-24`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            In Stock
          </label>
          <div>
            <label className="text-xs text-muted block mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground file:cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Product Video (optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground file:cursor-pointer"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : editId ? "Update Product" : "Add Product"}
            </button>
            {editId && (
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-xl bg-surface2 border border-border text-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-heading font-bold text-base mb-4">
          Products ({products.length})
        </h2>
        {loading ? (
          <p className="text-muted text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-muted text-sm">No products yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.id} className="bg-surface2 border border-border rounded-lg overflow-hidden">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="p-3">
                  <div className="font-heading font-semibold text-sm">{p.name}</div>
                  <div className="text-muted text-xs mt-1">{p.category} · {p.price}</div>
                  <div className="text-xs mt-1" style={{ color: p.inStock ? "#64dc82" : "var(--muted)" }}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex-1 py-2 rounded-lg bg-surface border border-border text-xs text-foreground font-medium cursor-pointer hover:brightness-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium cursor-pointer hover:brightness-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
