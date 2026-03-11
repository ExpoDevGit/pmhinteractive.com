# PMH Interactive Website — Setup Guide
### No coding needed — follow these steps

---

## 📁 Your Files

```
pmh-interactive/
├── index.html          ← Homepage
├── hero-bg.mp4         ← YOUR video goes here (you add this)
├── favicon.ico         ← Browser tab icon (you add this — optional)
├── css/style.css       ← Styling (no need to touch)
├── js/main.js          ← Logic (only touch for Formspree ID)
├── images/             ← Create this folder, add game screenshots here
└── pages/
    ├── games.html      ← All your games
    └── privacy.html    ← Privacy policy
```

---

## ✏️ What You Need to Edit

Search for `<!-- EDIT:` or `EDIT:` in any file to find things to change.
Use Notepad (Windows) or TextEdit (Mac) to open any .html file.

### Things to update:

| Location | What to find | Change to |
|---|---|---|
| `index.html` + all pages | `contact@pmhinteractive.com` | Your actual email |
| `index.html` + all pages | `privacy@pmhinteractive.com` | Your actual email |
| `index.html` socials section | `https://youtube.com/@YOUR_CHANNEL` | Your YouTube URL |
| `index.html` socials section | `https://tiktok.com/@YOUR_HANDLE` | Your TikTok URL |
| `index.html` socials section | `https://discord.gg/YOUR_INVITE` | Your Discord invite |
| `js/main.js` | `YOUR_FORM_ID` | Your Formspree form ID |

**Already filled in from your Wix site:**
- ✅ Instagram: @pmhinteractive
- ✅ Twitter/X: @pmhinteractive
- ✅ Galactabeat X: @galactabeat
- ✅ Merch store: obsessive-shadow-shop.fourthwall.com
- ✅ All Steam links
- ✅ All Meta Quest links
- ✅ All PlayStation wishlist links

---

## 🎬 Video Background

1. Get a short video clip (.mp4, under 15MB ideally — 15-60 seconds works great)
2. Name it exactly: `hero-bg.mp4`
3. Drop it in the main folder (same level as index.html)

**No video yet?** Open index.html, find `<video id="video-bg"` and delete the whole `<video>...</video>` block. The site still looks great without it.

---

## 🖼️ Game Cover Art

1. Create a folder called `images` inside your project folder
2. Add your game screenshots/artwork there
3. In `pages/games.html`, for each game find:
   ```html
   <div class="art-placeholder">👁️</div>
   ```
   Replace with:
   ```html
   <img src="../images/YOUR-IMAGE-FILENAME.jpg" alt="Game Name" />
   ```

---

## 📬 Contact Form (Formspree — Free)

1. Go to **formspree.io** and sign up free
2. Click "New Form" — it gives you an ID like `xabc1234`
3. Open `js/main.js` and find:
   ```javascript
   const FORMSPREE_ID = 'YOUR_FORM_ID';
   ```
4. Replace `YOUR_FORM_ID` with your actual ID

Form submissions will land directly in your email.

---

## 🌐 Publishing to GitHub Pages (Free Hosting)

1. Go to **github.com** — create a free account
2. Click **+** → **New repository**
3. Name it anything (e.g., `pmh-website`), check "Add a README", click **Create**
4. On the repo page, click **"uploading an existing file"**
5. Drag ALL the contents of your `pmh-interactive` folder into the upload area
6. Click **Commit changes**
7. Go to **Settings** → **Pages** (left sidebar)
8. Under Source: select **Deploy from a branch** → `main` → `/(root)` → **Save**
9. Wait 1-2 minutes → your site is live at:
   `https://YOUR-USERNAME.github.io/pmh-website`

---

## 🎨 Changing the Accent Color

Open `css/style.css`, find at the very top:
```css
--teal: #00d4b4;
```
Change `#00d4b4` to any color you want.
Use **coolors.co** to pick colors visually.

---

## ❓ Troubleshooting

- **Video not showing?** Make sure the file is named exactly `hero-bg.mp4` (lowercase, no spaces)
- **Images not showing?** Check the folder is named `images` and the filename matches exactly (case sensitive)
- **Form not working?** Make sure you replaced `YOUR_FORM_ID` in main.js with your real Formspree ID
- **Site looks broken?** Make sure all files are uploaded — especially the `css/` and `js/` folders
