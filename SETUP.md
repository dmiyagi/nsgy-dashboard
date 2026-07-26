# NSGY Triage — phone + computer setup (one time, ~10 min)

The app is a static web page. GitHub hosts it (Pages) and syncs your board through a **private secret Gist** in your own account. No servers to maintain, free.

## 1 · Put the app online (GitHub Pages)

1. Go to **github.com/new** → Repository name: `nsgy-dashboard` → **Public** → Create repository.
   (Public is fine — this is just the app code. Your consult data never goes in the repo; it lives in a *private* Gist.)
2. On the new repo page, click **"uploading an existing file"** → drag in ALL files from this folder
   (`index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) → **Commit changes**.
3. Repo **Settings → Pages** → under "Branch" pick **main** / root → **Save**.
4. Wait ~1–2 minutes. Your app is at:
   **`https://YOUR-USERNAME.github.io/nsgy-dashboard/`**

## 2 · Create the sync token (once)

1. github.com → your avatar → **Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. **Generate new token (classic)** → Note: `nsgy sync` → Expiration: 1 year (set a reminder) → check **only the `gist` scope** → Generate.
3. **Copy the token** (`ghp_…`). You'll paste it into the app on each device.

## 3 · Connect your devices

On **each** device (phone + computer):

1. Open the app URL in the browser.
2. Tap **⭘ sync** (top right) → paste the token → **Connect**.
   First device creates the private Gist; the others find it automatically.
3. **Phone**: Share button → **Add to Home Screen** → it installs like an app (full screen, works offline).

That's it. Changes push ~2.5 s after you make them and pull whenever the app becomes visible; **⟳ Sync now** forces it. The dot shows ● synced / ⟳ syncing / ⚠ error.

## Notes

- Merge is per-item by last edit, so phone and computer edits don't overwrite each other; deletions propagate.
- Offline (hospital dead zones): keep working — it syncs when you're back on network.
- The token lives only in each device's browser storage. **Disconnect** (in the sync panel) removes it.
- Keep entries de-identified: bed + initials, never names or MRNs.
- To update the app later: replace `index.html` in the repo (Add file → Upload → commit). Data is untouched.
