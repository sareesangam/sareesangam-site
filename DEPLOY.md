# Deploying Saree Sangam — Free Hosting via GitHub Pages

This gives you a live site at **https://www.sareesangam.com** with **$0 hosting cost**,
using GitHub Pages for hosting and GoDaddy only for domain DNS.

Everything below only needs to be done once. After that, adding new product photos
is just: drop image in `products/` folder → push to GitHub → done.

---

## Part 1 — Create a GitHub account

1. Go to https://github.com/join
2. Sign up (free). Verify your email.
3. Remember your **username** — you'll need it below (referred to as `YOUR_GITHUB_USERNAME`).

---

## Part 2 — Create a repository and upload the site

**Easiest option (no command line, using the browser):**

1. Log in to GitHub → click the **+** icon (top right) → **New repository**.
2. Repository name: `sareesangam-site`
3. Set it to **Public** (required for free GitHub Pages).
4. Click **Create repository**.
5. On the new repo page, click **uploading an existing file**.
6. Drag in ALL the files/folders from this project folder on your computer:
   - `index.html`
   - `contact.html`
   - `css/` folder
   - `js/` folder
   - `products/` folder (with your product images inside it)
   - `CNAME`
7. Scroll down, click **Commit changes**.

**Option 2 (if you're comfortable with git/command line):**

```
cd path\to\sareesangam-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sareesangam-site.git
git push -u origin main
```

---

## Part 3 — Update the gallery config with your username

1. In your GitHub repo, open `js/gallery.js`.
2. Click the pencil (Edit) icon.
3. Change this line:
   ```js
   const GITHUB_USER = "YOUR_GITHUB_USERNAME";
   ```
   to your actual GitHub username, e.g.:
   ```js
   const GITHUB_USER = "janedoe123";
   ```
4. Commit the change.

(This tells the homepage where to automatically pull product photos from.)

---

## Part 4 — Turn on GitHub Pages

1. In your repo, go to **Settings** → **Pages** (left sidebar).
2. Under "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: select **main**, folder **/ (root)** → **Save**.
4. Wait 1–2 minutes. GitHub will show a URL like:
   `https://YOUR_GITHUB_USERNAME.github.io/sareesangam-site/`
   Open it to confirm the site works.

---

## Part 5 — Point your GoDaddy domain to GitHub Pages

You keep your domain registered at GoDaddy — you're only changing its DNS records so
it points to GitHub's free servers instead of paying for GoDaddy hosting.

1. Log in to https://dcc.godaddy.com/ (GoDaddy domain dashboard).
2. Find `sareesangam.com` → click **DNS** / **Manage DNS**.
3. Add/edit these records (delete any existing conflicting A or CNAME records for `@` and `www` first):

   | Type  | Name | Value                          | TTL     |
   |-------|------|---------------------------------|---------|
   | A     | @    | 185.199.108.153                 | 1 hour  |
   | A     | @    | 185.199.109.153                 | 1 hour  |
   | A     | @    | 185.199.110.153                 | 1 hour  |
   | A     | @    | 185.199.111.153                 | 1 hour  |
   | CNAME | www  | YOUR_GITHUB_USERNAME.github.io   | 1 hour  |

4. Save. DNS changes can take anywhere from a few minutes to a few hours to fully propagate.

5. Back in GitHub → **Settings** → **Pages**:
   - Under "Custom domain", enter: `www.sareesangam.com` → **Save**.
   - Wait for the DNS check to pass (green checkmark), then tick **Enforce HTTPS**.
   - (The `CNAME` file already in this repo does this automatically too, but entering it
     in the UI ensures GitHub issues an SSL certificate.)

6. Visit **https://www.sareesangam.com** — your site should now be live, for free, with
   a valid HTTPS certificate managed automatically by GitHub.

> Note: `sareesangam.com` (without www) will not automatically redirect to `www.sareesangam.com`
> unless you add GoDaddy forwarding. In GoDaddy dashboard → Domain → **Forwarding** → add a
> forward from `sareesangam.com` to `https://www.sareesangam.com`.

---

## Updating your product photos later

1. Go to your repo on GitHub → open the `products` folder.
2. Click **Add file** → **Upload files** → drag in new photos → **Commit**.
3. To remove a photo, open it in the folder → click the trash icon → **Commit**.
4. Refresh your website after a minute — new images appear automatically. No code changes needed.

## Editing contact details

Open `contact.html` in the repo, click the pencil (Edit) icon, and update the phone
number, email, and address near the top. Commit the change and it goes live automatically.
