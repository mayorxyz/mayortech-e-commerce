const fs = require('fs');
const path = './src/pages/AdminPage.tsx';
let s = fs.readFileSync(path, 'utf8');
const old1 = `        await addProduct({
          name, price: priceNum, category, description,
<<<<<<< HEAD
          image_url: imageUrlsToUse[0] || "", video_url: videoUrl || undefined, in_stock: inStock, sold,
          condition, images: imageUrlsToUse, specifications: specsObj, brand, tagline,
=======
          image_url: imageUrls[0] || "", video_url: videoUrl || undefined, in_stock: inStock,
          sold: false, condition, images: imageUrls, specifications: specsObj, brand, tagline,
>>>>>>> ea94d85869ecab6cbaf265bbd0ae2c7018630639
        });`;
const new1 = `        await addProduct({
          name, price: priceNum, category, description,
          image_url: imageUrlsToUse[0] || "", video_url: videoUrl || undefined, in_stock: inStock, sold,
          condition, images: imageUrlsToUse, specifications: specsObj, brand, tagline,
        });`;
const old2 = `                    <button
                      onClick={() => handleToggleSold(p)}
                      className={
                        p.sold
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-surface border border-border text-foreground"
                      }
                    >
                      {p.sold ? "Unsold" : "Mark Sold"}
                    </button>
                    <button
<<<<<<< HEAD
                      onClick={() => handleDelete(p.id)}
=======
                      onClick={() => deleteProduct(p.id)}
>>>>>>> ea94d85869ecab6cbaf265bbd0ae2c7018630639
                      className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium cursor-pointer hover:brightness-90"
                    >
                      Delete`;
const new2 = `                    <button
                      onClick={() => handleToggleSold(p)}
                      className={
                        p.sold
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : "bg-surface border border-border text-foreground"
                      }
                    >
                      {p.sold ? "Unsold" : "Mark Sold"}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium cursor-pointer hover:brightness-90"
                    >
                      Delete`;
if (!s.includes(old1)) {
  console.error('Old1 block not found');
  process.exit(1);
}
if (!s.includes(old2)) {
  console.error('Old2 block not found');
  process.exit(1);
}
s = s.replace(old1, new1).replace(old2, new2);
fs.writeFileSync(path, s, 'utf8');
console.log('Conflict blocks removed.');
