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

That's it. Changes push ~2.5 s after you make them, and pull every minute while the app is open plus whenever it becomes visible; **⟳ Sync now** forces it. The dot is the status: **green** synced, **red** changes still only on this device (or the last sync failed), **grey** never paired. Tap it to open the sync panel.

## Notes

- **Rounds — exams:** each recorded exam has **✕ Delete**; the current exam box has **✕ Clear**, and **✕ Clear all** wipes the box plus the whole trend. All three are undoable.
- **Rounds — 24 hr view:** the **◑ 24 hr** toggle switches from the 3 day checks (AM seen · 1p · 4p) to the full 5 across a day/night — **AM seen · 1p chart · 4p chart · PM seen · AM chart** (the last one is the chart review before morning sign-out) — with an n/5 counter per patient. **Reset seen ✓** clears seen, all checks and all rest timers together (undoable).
- **Text consult:** the builder inside a card now uses the same 1-2-3 layout, and the same engine, as the one on the Board — the same card produces identical text in both. Nothing is pre-filled: **✦ Suggest from card** fills it when you want it, **⇣ Pull from this card** seeds the free-text box, and **✕ Clear** empties it (undoable). Editing a piece no longer silently rewrites Ready-to-send — hit **⇡ Rebuild clean version**.
- **Consult form order (v0.0.55 · 2026-08-29):** timing/reschedule sits directly under owner/team/attending; warning flags are followed by the collapsed suggestions, rubrics, classifiers, and scores, then Text consult. To-Do and Notes sit immediately before E/O/W/C classification.
- **Consult checks (v0.0.56 · 2026-08-29):** negated cauda symptoms such as "no bowel or bladder symptoms" no longer raise the cauda warning, calculator cards default closed and remember open/closed state for the session, and the ICH calculator includes `(A x B x C) / 2` volume entry in cm.
- **Consult flow (v0.0.57 · 2026-08-29):** E timers are now Routine 2 h, Time-sensitive 1 h, Urgent 30 min, Emergent now; the E/O/W/C rows sit directly under timing with labels inside each compact row, and Ready-to-send auto-updates as HPI, imaging, vitals/labs, exam, and plan text is entered.
- **Text consult plans (v0.0.58 · 2026-08-29):** generated plans no longer add generic "Review imaging + priors" or "Dispo per our review" filler.
- **Consult compact rows (v0.0.59 · 2026-08-29):** E/O/W/C more/less controls sit inline at the right edge of each compact row, and ICH volume A/B/C fields type normally left-to-right.
- **ICH consult text (v0.0.60 · 2026-08-29):** ICH scores now render as `ICH score N`, ICH volume appears in imaging as `estimated vol XXmL`, and generated hemorrhage plans use `CTH 4-6 hrs or exam decline` plus `SBP <140, EuNa`.
- **Board priority (v0.0.61 · 2026-08-29):** the Board now sorts by the earliest active timer first, using the consult auto-review timer when no explicit timer is set, then breaks ties by E/O/W/C priority.
- **iOS/watch priority parity (v0.0.62 · 2026-08-29):** manual timer clearing restores consult auto-review timers, saved non-manual review timers normalize to the current E windows on load, and the compact watch/phone next-item view uses the same timer-first then E/O/W/C ordering.
- **Rounds compact iOS (v0.0.63 · 2026-08-29):** compact rounding rows now keep a square rounds check visible at the left, show chart-status circles beside it, put tags after the patient identifiers, and use a square to-do check before the active to-do text.
- **Compact timers/colors (v0.0.64 · 2026-08-29):** compact Board and Rounds rows surface timers near the left edge on iOS, while green button styling is reserved for completed/checked states.
- **Wound checks** can be taken off the list from the row (**✕ Remove from wound list**) or via the card's Wound list button, both undoable.
- Any task card (consent, comm, proc…) with nothing outstanding now shows its **Done** button.
- **Rounds rounds-schedule:** ticking a check **archives** that patient until the next round is actually due — 1 pm, 4 pm, 6 pm (PM seen), 9 pm, then the 5 am chart. **AM seen** is re-triggered by **Reset seen ✓ (AM)**, which clears every check and empties the archive for a new day. Archived patients sit in their own collapsible section showing when each comes back; tap a row (or **↩ Bring all back**) to pull one forward early. Day view keeps the 3-stage version (AM seen · 1 pm · 4 pm). Rounds always open compact after a reload.
- **Rounds — the far-right button** is the stage control: it names the next check owed (`✓ 1p chart`), and tapping it ticks that stage and archives the patient until the next scheduled round. The dots on each row keep the running record of which stages are done. Tap the `◷ 2h 14m` timer to bring a patient back early, or `✓ 5/5` to reopen the last check.

- **NCCU view:** send a patient here from the **Send** bar on their Rounds card (pick *● NCCU sign-out view*). Each card carries an **Exam** box (current plus the last two exams with timestamps), **To-Dos** and **Notes**; compact mode keeps the next to-do and a notes preview. **Δ Changes** highlights new/current changed words in yellow; removed words are not shown. Negations and absence terms (no, denies, afebrile, WNL, NKDA…) render in green whether or not diffing is on; tap a card's **Δn ✕** badge to restart that card's tracking from a clean slate, or **Δ Reset all** for the whole list (both undoable). To-dos sit above notes and carry board-style timers; **Compact** shows the next to-do with its countdown, and each card can be flipped Expand/Compact on its own. Remove a card with the **✕** (desktop) or by swiping it left (phone) — both undoable.
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
