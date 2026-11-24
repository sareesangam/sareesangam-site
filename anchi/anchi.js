// Same GitHub-folder approach as the main site, reading products/anchi.
const GITHUB_USER = "sareesangam";
const GITHUB_REPO = "sareesangam-site";
const GITHUB_BRANCH = "main";
const PRODUCTS_FOLDER = "products/anchi";
const WHATSAPP = "919471005355";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
let products = [];
let category = "all";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "FREE"];
const SIZE_RE = /^(xs|s|m|l|xl|xxl|3xl|free)(-(xs|s|m|l|xl|xxl|3xl|free))*$/i;
let sizeFilter = "all";

// File name: [new-]name-of-product[_PRICE][_SIZES].ext  e.g. khadi-kurti_1299_S-M-L.jpg
function parse(file, index) {
  const parts = file.name.replace(IMAGE_EXT, "").split("_");
  let base = parts.shift();
  let price = null;
  let sizes = [];
  parts.forEach(part => {
    if (/^\d+$/.test(part)) price = parseInt(part, 10);
    else if (SIZE_RE.test(part)) sizes = part.toUpperCase().split("-");
  });
  const isNew = /^new-/i.test(base);
  if (isNew) base = base.replace(/^new-/i, "");
  const title = base.replace(/-+/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
  return { title, price, sizes, isNew, url: file.download_url, key: base.toLowerCase(), index };
}

function priceText(p) { return "₹" + p.toLocaleString("en-IN") + ".00"; }

// ----- Lightbox -----
function openLightbox(p) {
  const box = document.getElementById("lightbox");
  document.getElementById("lb-img").src = p.url;
  document.getElementById("lb-img").alt = p.title;
  document.getElementById("lb-title").textContent = p.title;
  document.getElementById("lb-price").textContent = p.price != null ? priceText(p.price) : "";
  document.getElementById("lb-sizes").textContent = p.sizes.length ? "Sizes: " + p.sizes.join(", ") : "";
  document.getElementById("lb-enquire").href = whatsappLink(p);
  box.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  document.getElementById("lightbox").hidden = true;
  document.getElementById("lb-img").src = "";
  document.body.style.overflow = "";
}
function whatsappLink(p) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hi, I am interested in Anchi: " + p.title);
}

function render() {
  const gallery = document.getElementById("gallery");
  const sort = document.getElementById("sort").value;
  const list = products.filter(p =>
    (category === "all" || category.split(",").some(k => p.key.includes(k))) &&
    (sizeFilter === "all" || p.sizes.includes(sizeFilter)));
  const byName = (a, b) => a.title.localeCompare(b.title);
  const sorters = {
    new: (a, b) => b.isNew - a.isNew || b.index - a.index,
    az: byName,
    za: (a, b) => byName(b, a),
    low: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
    high: (a, b) => (b.price ?? -1) - (a.price ?? -1),
  };
  list.sort(sorters[sort]);
  gallery.replaceChildren();
  document.getElementById("count").textContent = list.length + " product" + (list.length === 1 ? "" : "s");

  list.forEach(p => {
    const item = document.createElement("div");
    item.className = "gallery-item";
    const img = document.createElement("img");
    img.src = p.url; img.alt = p.title; img.loading = "lazy";
    img.className = "zoomable";
    img.tabIndex = 0;
    img.addEventListener("click", () => openLightbox(p));
    img.addEventListener("keydown", e => { if (e.key === "Enter") openLightbox(p); });
    item.appendChild(img);
    if (p.isNew) {
      const b = document.createElement("span");
      b.className = "badge"; b.textContent = "NEW";
      item.appendChild(b);
    }
    const cap = document.createElement("div");
    cap.className = "caption";
    const t = document.createElement("span");
    t.className = "title"; t.textContent = p.title;
    cap.appendChild(t);
    if (p.price != null) {
      const pr = document.createElement("span");
      pr.className = "price"; pr.textContent = priceText(p.price);
      cap.appendChild(pr);
    }
    if (p.sizes.length) {
      const sz = document.createElement("div");
      sz.className = "sizes";
      p.sizes.forEach(s => {
        const chip = document.createElement("span");
        chip.className = "size-chip"; chip.textContent = s;
        sz.appendChild(chip);
      });
      cap.appendChild(sz);
    }
    const a = document.createElement("a");
    a.className = "enquire";
    a.href = whatsappLink(p);
    a.textContent = "Enquire on WhatsApp";
    a.target = "_blank"; a.rel = "noopener";
    cap.appendChild(a);
    item.appendChild(cap);
    gallery.appendChild(item);
  });

  document.getElementById("gallery-status").textContent =
    list.length ? "" : "No products in this category yet. Check back soon!";
}

// Local preview only: when run on localhost (e.g. `python -m http.server`),
// read the folder listing instead of the GitHub API.
async function loadLocal(origErr) {
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw origErr;
  const base = "../" + PRODUCTS_FOLDER + "/";
  const res = await fetch(base);
  if (!res.ok) throw origErr;
  const doc = new DOMParser().parseFromString(await res.text(), "text/html");
  return [...doc.querySelectorAll("a")]
    .map(a => decodeURIComponent(a.getAttribute("href")))
    .map(name => ({ type: "file", name, download_url: base + encodeURIComponent(name) }));
}

async function load() {
  const status = document.getElementById("gallery-status");
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PRODUCTS_FOLDER}?ref=${GITHUB_BRANCH}`;
  try {
    let files;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not read products folder (" + res.status + ")");
      files = await res.json();
    } catch (apiErr) {
      files = await loadLocal(apiErr);
    }
    products = files.filter(f => f.type === "file" && IMAGE_EXT.test(f.name)).map(parse);
    status.textContent = "";
    render();
  } catch (err) {
    status.textContent = "Couldn't load products right now. Please try again later.";
    console.error(err);
  }
}

document.querySelectorAll(".cat-tile").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".cat-tile").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  category = btn.dataset.cat;
  render();
}));
document.getElementById("sort").addEventListener("change", render);

// Size filter chips
const sizeBar = document.getElementById("size-filter");
["all", ...SIZE_ORDER].forEach(s => {
  const b = document.createElement("button");
  b.className = "size-btn" + (s === "all" ? " active" : "");
  b.dataset.size = s;
  b.textContent = s === "all" ? "All sizes" : s;
  b.addEventListener("click", () => {
    sizeBar.querySelectorAll(".size-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    sizeFilter = s;
    render();
  });
  sizeBar.appendChild(b);
});

// Lightbox close handlers
document.getElementById("lightbox").addEventListener("click", e => {
  if (e.target.id === "lightbox" || e.target.id === "lb-close") closeLightbox();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
load();
