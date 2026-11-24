# Anchi – how to add and update products

The Anchi page (`sareesangam.com/anchi/`) builds itself from the photos in this folder (`products/anchi/`).
There is no list to edit: **add, rename or delete a photo, push to GitHub, and the page updates** within a minute or two.

## 1. File name format

```
[new-]name-of-product_PRICE_SIZES.jpg
```

| Part | Required | Meaning | Example |
|---|---|---|---|
| `new-` prefix | no | Shows a **NEW** badge | `new-...` |
| `name-of-product` | yes | Title on the card (dashes become spaces). **Must contain the category keyword.** | `khadi-block-print-kurti` |
| `PRICE` | no | Price in rupees, digits only | `1299` → ₹1,299.00 |
| `SIZES` | no | Sizes joined by dashes: `XS S M L XL XXL 3XL FREE` | `S-M-L-XL` |

Parts are separated by an **underscore `_`**; words inside the name and sizes use a **dash `-`**.
Allowed image types: jpg, jpeg, png, webp, gif. Use no spaces in the file name.

## 2. Categories (decided by a keyword in the name)

| Category tile | Put this word in the file name | Example file name |
|---|---|---|
| Mulcotton | `mulcotton` (or `mul-cotton`) | `new-mulcotton-green-kurti_1299_S-M-L-XL.jpg` |
| Khadi | `khadi` | `khadi-white-kurti_1499_M-L-XL-XXL.jpg` |
| Short Kurti | `short` | `short-kurti-blue_899_XS-S-M-L.jpg` |
| Tunic | `tunic` (or `tulic`) | `tunic-turquoise_999_S-M-L-XL-XXL.jpg` |

A photo with none of these words still appears under **All**, just not under a category tile.

## 3. Upload new photos

**On GitHub (no software needed)**
1. Open the repo `sareesangam/sareesangam-site` → folder `products` → `anchi`.
2. Click **Add file → Upload files**, drag in the photos (already named as above).
3. Click **Commit changes**.

**From your computer**
1. Copy the photos into `products/anchi/`.
2. Run:
   ```
   git add products/anchi
   git commit -m "Add Anchi products"
   git push origin main
   ```

## 4. Update sizes, price, badge or category

These all live in the file name, so **rename the file**:

- **Change sizes:** `short-kurti-blue_899_S-M-L.jpg` → `short-kurti-blue_899_S-M-L-XL.jpg`
- **Change price:** `short-kurti-blue_899_S-M-L.jpg` → `short-kurti-blue_999_S-M-L.jpg`
- **Remove NEW badge:** delete the `new-` at the start.
- **Move category:** change the keyword in the name (e.g. `short-` → `khadi-`).
- **Sold out / remove:** delete the file.

On GitHub: open the file → pencil/`…` menu → **Rename**, edit the name → **Commit changes**.
From your computer: rename the file, then `git add -A products/anchi`, commit and push.

## 5. Size filter

The size buttons above the grid (XS, S, M, L, XL, XXL, 3XL, FREE) show only products whose file name lists that size.
A photo with no sizes in its name never matches a size filter, but still appears under **All sizes**.

## 6. Tips

- Portrait photos (about 800×1200 px, under ~200 KB) look best and load fast.
- The cards sort by **Date, new to old** by default (NEW items first); shoppers can also sort by name or price.
- Clicking a photo opens a large view with title, price, sizes and a WhatsApp enquiry button.
- If a change doesn't show, wait a minute and hard-refresh (Ctrl+F5).

## 7. Preview before pushing

From the site folder run `python -m http.server 8000`, then open
`http://127.0.0.1:8000/anchi/index.html`. The page reads the local folder when run on localhost.

## Note

The photos currently in this folder are free Pexels stock images used as placeholders. Replace them with your real Anchi photos.
