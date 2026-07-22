// ===== CONFIGURE THIS =====
// Replace with your GitHub username and the repository name you create for this site.
// Example: if your repo is at https://github.com/janedoe/sareesangam-site
//   GITHUB_USER = "janedoe"
//   GITHUB_REPO = "sareesangam-site"
const GITHUB_USER = "sareesangam";
const GITHUB_REPO = "sareesangam-site";
const GITHUB_BRANCH = "main";
const PRODUCTS_FOLDER = "products";
// ===========================

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  const status = document.getElementById("gallery-status");
  const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PRODUCTS_FOLDER}?ref=${GITHUB_BRANCH}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Could not read products folder (" + res.status + ")");
    const files = await res.json();

    const images = files.filter(f => f.type === "file" && IMAGE_EXT.test(f.name));

    if (images.length === 0) {
      status.textContent = "No products added yet. Check back soon!";
      return;
    }

    status.remove();
    images
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(file => {
        const item = document.createElement("div");
        item.className = "gallery-item";

        const img = document.createElement("img");
        img.src = file.download_url;
        img.alt = titleFromFilename(file.name);
        img.loading = "lazy";

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.textContent = titleFromFilename(file.name);

        item.appendChild(img);
        item.appendChild(caption);
        gallery.appendChild(item);
      });
  } catch (err) {
    status.textContent = "Couldn't load products right now. Please try again later.";
    console.error(err);
  }
}

function titleFromFilename(name) {
  return name
    .replace(IMAGE_EXT, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

loadGallery();
