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
   The token is the *only* thing to copy between devices — the first device creates the private Gist and every other device finds that same Gist on its own.
3. **Phone**: Share button → **Add to Home Screen** → it installs like an app (full screen, works offline).

That's it. Changes push ~2.5 s after you make them, and pull every minute while the app is open plus whenever it becomes visible; **⟳ Sync now** forces it. The dot shows ● synced / ⟳ syncing / ● pending / ⚠ error.

## Notes

- **Rounds — exams:** each recorded exam has **✕ Delete**; the current exam box has **✕ Clear**, and **✕ Clear all** wipes the box plus the whole trend. All three are undoable.
- **Rounds — 24 hr view:** the **◑ 24 hr** toggle switches from the 3 day checks (AM seen · 1p · 4p) to the full 5 across a day/night — **AM seen · 1p chart · 4p chart · PM seen · AM chart** (the last one is the chart review before morning sign-out) — with an n/5 counter per patient. **Reset seen ✓** clears seen, all checks and all rest timers together (undoable).
- **Text consult:** the builder inside a card now uses the same 1-2-3 layout, and the same engine, as the one on the Board — the same card produces identical text in both. Nothing is pre-filled: **✦ Suggest from card** fills it when you want it, **⇣ Pull from this card** seeds the free-text box, and **✕ Clear** empties it (undoable). Editing a piece no longer silently rewrites Ready-to-send — hit **⇡ Rebuild clean version**.
- **Wound checks** can be taken off the list from the row (**✕ Remove from wound list**) or via the card's Wound list button, both undoable.
- Any task card (consent, comm, proc…) with nothing outstanding now shows its **Done** button.
- **Rounds rounds-schedule:** ticking a check **archives** that patient until the next round is actually due — 1 pm, 4 pm, 6 pm (PM seen), 9 pm, then the 5 am chart. **AM seen** is re-triggered by **Reset seen ✓ (AM)**, which clears every check and empties the archive for a new day. Archived patients sit in their own collapsible section showing when each comes back; tap a row (or **↩ Bring all back**) to pull one forward early. Day view keeps the 3-stage version (AM seen · 1 pm · 4 pm). Rounds always open compact after a reload.
- **Rounds — the far-right button** is the stage control: it names the next check owed (`✓ 1p chart`), and tapping it ticks that stage and archives the patient until the next scheduled round. The dots on each row keep the running record of which stages are done. Tap the `◷ 2h 14m` timer to bring a patient back early, or `✓ 5/5` to reopen the last check.

- **NCCU view:** send a patient here from the **Send** bar on their Rounds card (pick *● NCCU sign-out view*). Each card carries an **Exam** box (current plus the last two exams with timestamps), **To-Dos** and **Notes**; compact mode keeps the next to-do and a notes preview. **Δ Changes** highlights what moved in each field since the start of the day — added words in yellow, **removed words struck through in red**, so losing a "no" from "no seizures" is visible; negations and absence terms (no, denies, afebrile, WNL, NKDA…) render in green whether or not diffing is on; tap a card's **Δn ✕** badge to restart that card's tracking from a clean slate, or **Δ Reset all** for the whole list (both undoable). To-dos sit above notes and carry board-style timers; **Compact** shows the next to-do with its countdown, and each card can be flipped Full/Compact on its own. Remove a card with the **✕** (desktop) or by swiping it left (phone) — both undoable.
- Everything you type is written to the device within half a second — no need to tap away first. Nothing is lost if the app is backgrounded or killed mid-entry.
- Merge is per-item by last edit, so phone and computer edits don't overwrite each other; deletions propagate.
- If the token expires or the gist is deleted, sync stops with a **⚠ sync** dot and an explanation in the sync panel rather than retrying silently. Your work keeps saving locally; reconnect and it pushes.
- If two devices ever drift apart, open the sync panel on the odd one out and tap **Re-scan & repair** — it rejoins the shared Gist and carries its own entries over.
- Not seeing a change you expect? Tap the small version line under the title to clear the cache and reload.
- GitHub allows 5000 API calls per hour per account. Idle devices now poll with a conditional request, which GitHub does not charge, so sitting open costs nothing. If the limit is ever hit, the dot turns **◷** and syncing pauses until the hour resets, then resumes on its own — nothing is lost.
- Offline (hospital dead zones): keep working — it syncs when you're back on network.
- The token lives only in each device's browser storage. **Disconnect** (in the sync panel) removes it.
- Keep entries de-identified: bed + initials, never names or MRNs.
- To update the app later: replace `index.html` in the repo (Add file → Upload → commit). Data is untouched.
