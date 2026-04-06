import { useState } from "react";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, X } from "lucide-react";

const CATEGORY_OPTIONS = ["phones", "laptops", "earphones", "powerbanks", "accessories", "others"];
const CONDITION_OPTIONS = ["Brand New", "UK Used", "Foreign Used"];

export default function AdminPage() {
  const { products, loading, addProduct, updateProduct, deleteProduct, uploadFile } = useSupabaseProducts();
  const { logout } = useAuth();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("phones");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [condition, setCondition] = useState("Brand New");
  const [brand, setBrand] = useState("");
  const [tagline, setTagline] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>([{key: "", value: ""}]);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const resetForm = () => {
    setName(""); setCategory("phones"); setPrice(""); setDescription("");
    setInStock(true); setCondition("Brand New"); setBrand(""); setTagline("");
    setImageFiles([]); setVideoFile(null); setSpecifications([{key: "", value: ""}]); setEditId(null);
  };

  const handleSubmit = async () => {
    if (!name || !price) { setMsg("Name and price are required"); return; }
    setUploading(true); setMsg("");
    try {
      // Upload multiple images
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadFile(file, "images");
        imageUrls.push(url);
      }

      let videoUrl = "";
      if (videoFile) videoUrl = await uploadFile(videoFile, "videos");

      const priceNum = parseInt(price.replace(/\D/g, "")) || 0;

      // Convert specifications array to object
      const specsObj: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key.trim() && spec.value.trim()) {
          specsObj[spec.key.trim()] = spec.value.trim();
        }
      });

      if (editId) {
        const updates: any = {
          name, price: priceNum, category, description, in_stock: inStock,
          condition, brand, tagline, specifications: specsObj
        };
        if (imageUrls.length > 0) updates.images = imageUrls;
        if (videoUrl) updates.video_url = videoUrl;
        await updateProduct(editId, updates);
        setMsg("Product updated!");
      } else {
        await addProduct({
          name, price: priceNum, category, description,
          image_url: imageUrls[0] || "", video_url: videoUrl || undefined, in_stock: inStock,
          sold: false, condition, images: imageUrls, specifications: specsObj, brand, tagline,
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
    setCondition(p.condition || "Brand New");
    setBrand(p.brand || "");
    setTagline(p.tagline || "");
    setImageFiles([]);
    setVideoFile(null);
    // Convert specifications object to array
    const specsArray = Object.entries(p.specifications || {}).map(([key, value]) => ({key, value: value as string}));
    setSpecifications(specsArray.length > 0 ? specsArray : [{key: "", value: ""}]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addSpecification = () => {
    setSpecifications([...specifications, {key: "", value: ""}]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setMsg("Maximum 5 images allowed");
      return;
    }
    setImageFiles(files);
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
        <div className="grid gap-4">
          <input className={inputClass} placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-3">
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select className={inputClass} value={condition} onChange={(e) => setCondition(e.target.value)}>
              {CONDITION_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Price (e.g. 285000)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input className={inputClass} placeholder="Brand (e.g. Apple, Samsung)" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>

          <input className={inputClass} placeholder="Tagline (short description for card)" value={tagline} onChange={(e) => setTagline(e.target.value)} />

          <textarea
            className={`${inputClass} resize-none h-32`}
            placeholder="Full Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Specifications</label>
              <button
                type="button"
                onClick={addSpecification}
                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Spec
              </button>
            </div>
            <div className="space-y-2">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    className={`${inputClass} flex-1`}
                    placeholder="Spec name (e.g. RAM)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  />
                  <input
                    className={`${inputClass} flex-1`}
                    placeholder="Value (e.g. 8GB)"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  />
                  {specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

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
            <label className="text-xs text-muted block mb-1">Product Images (up to 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFilesChange}
              className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground file:cursor-pointer"
            />
            {imageFiles.length > 0 && (
              <p className="text-xs text-muted mt-1">{imageFiles.length} image(s) selected</p>
            )}
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
