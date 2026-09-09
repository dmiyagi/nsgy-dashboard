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
- **Rounds diagnosis chip (v0.0.65 · 2026-08-29):** compact Rounds rows now show one primary-diagnosis chip immediately after the patient name, with the longer problem text hidden on iPhone to preserve checkmark and timer visibility.
- **Rounds team chip (v0.0.66 · 2026-08-29):** compact Rounds rows keep the team color chip visible beside the primary-diagnosis chip on iOS.
- **ICH trial criteria (v0.0.67 · 2026-08-29):** spontaneous/nontraumatic ICH consults surface an expandable NICO/REACH criteria checklist with a To-Do loader, and compact Rounds rows restore the metadata tags while emphasizing the primary diagnosis chip.
- **SAH rule-out pathway (v0.0.68 · 2026-08-29):** unclear/suspected/rule-out aSAH text now gets its own SAH unknown-source suggestion, checklist, lab flag, HH/mFisher aid, and `r/o aSAH` rounds tag instead of being treated as confirmed aSAH.
- **Consult workflow timers (v0.0.69 · 2026-08-29):** checking Staffed-Attg now arms a 5-minute timer for Comm'd Plan; checking Comm'd Plan now arms a 2-hour timer for the note.
- **Stage B close checks (v0.0.70 · 2026-08-29):** Close-consult checklist items persist on the card, generated Stage B to-dos satisfy the same checklist when checked off, and the modal reopens with completed items already checked.
- **NCCU compact diagnosis chip (v0.0.72 · 2026-09-02):** compact NCCU cards now reserve visible badge-row space for the prominent diagnosis tag so long one-liners truncate after the higher-value tag is visible.
- **Quick removal procedures (v0.0.73 · 2026-09-02):** quick proc matching now has separate Remove dressing, Remove staples, and Remove sutures presets with the requested supplies and tracker to-dos.
- **Timer and Board filter fixes (v0.0.74 · 2026-09-04):** discontinue/overdue timer clearing now leaves consult review timers off instead of rearming them, and saving a new card no longer silently filters the Board down to that card type.
- **Board wipe behavior (v0.0.75 · 2026-09-05):** wiping the Board now keeps future snoozed tasks scheduled instead of deleting/tombstoning them through sync.
- **Rounds 24-hour persistence (v0.0.76 · 2026-09-06):** the Rounds 24-hour toggle now syncs with a last-change timestamp so reloads and older devices do not silently reset it back to day view.
- **Rounds exam saving (v0.0.77 · 2026-09-06):** Exam trend now has an explicit Save exam button that commits through the same duplicate-safe history logic and avoids the blur/re-render click race.
- **Calendar wound checks (v0.0.78 · 2026-09-06):** Calendar view again shows the inpatient/former suture-staple-incision check lists, with separate picker IDs so it can coexist with the Rounds copy safely.
- **Direct wound checks (v0.0.79 · 2026-09-06):** Calendar and Rounds now have a direct Add wound check button that creates a standalone synced wound-list patient without first adding them to Rounds.
- **Rounds wound list merge (v0.0.80 · 2026-09-06):** Rounds now shows one combined wound-check list and dedupes active/former entries with the same room plus patient name.
- **Wound list sorting (v0.0.81 · 2026-09-06):** wound-check lists now sort by room/bed first, then patient/name text alphabetically.
- **SO board + wound sends (v0.0.82 · 2026-09-07):** the former NCCU tab is now a template-aware SO Board that keeps each card's chosen sign-out format, surfaces high-value boxes with EVD/drain/vent/Na/BP toggles, and wound-list rows can send Quick proc or Floor proc cards directly to the Board.
- **Smart consult capture + bolt kit (v0.0.83 · 2026-09-07):** Type-anything consult capture now splits leading room/patient/problem text such as `EDCC1A UnkTim SDH w/4 cm MLS`, preserves longer patient tokens, normalizes simple cm spacing, and Bolt/Licox supplies include a stapler.
- **Admission prep cards (v0.0.84 · 2026-09-07):** Board cards now include an Admission prep type with default to-dos for meds list, med rec, H&P, and admit orders.
- **SO/CC board sync + trends (v0.0.85 · 2026-09-07):** marking a Rounds patient SO/CC now adds them to the template-aware SO Board, removing them clears that link, and trend fields now retain prior values across all SO templates for labs, I/Os/output, Na, BP/vitals, EVD/drains, vent, TCDs, micro/CSF, renal, and related boxes.
- **SO editor board toggle (v0.0.86 · 2026-09-07):** the sign-out editor now has an SO Board button so the current patient can be added to or removed from the SO Board without leaving the modal.
- **Wound list scan view (v0.0.87 · 2026-09-07):** wound-check rows now use Rounds-style room/team/target/diagnosis tags, highlight removal dates in the problem text, and surface next/remove/seen date chips for faster scanning.
- **Sticky timer-off behavior (v0.0.88 · 2026-09-07):** clearing overdue/timer alerts now saves a card-level timers-off state so consult auto-review timers do not restart after completing or toggling a task; setting a new timer manually turns timers back on.
- **Admission prep workflow cleanup (v0.0.89 · 2026-09-07):** Admission prep cards now use only the four bottom workflow buttons for meds list, med rec, H&P, and admit orders, and old duplicated checkbox tasks are cleaned on load/save.
- **Rounds SO/chart/wound workflow (v0.0.90 · 2026-09-07):** Rounds cards now use a single SO button that marks the room for sign-out and opens the SO editor, direct Wound list and Chart check buttons move patients off active Rounds after creating the destination item, wound rows hide low-value diagnosis/former chips, and SO exam fields auto-fill from the saved Rounds exam trend when blank.
- **Wound edit + compact mode (v0.0.91 · 2026-09-07):** Wound-check rows now have a shared Compact/Full toggle plus an expanded top-line preview and inline editor for room/patient and wound/removal text.
- **Session-only wound expansion (v0.0.92 · 2026-09-07):** wound list sections and patient detail rows stay open while the app is running, but reopen closed after a fresh launch; newly added wound items still open their section immediately.
- **Consult form text builder placement (v0.0.93 · 2026-09-07):** the Text consult builder now sits directly under the owner/team/attending timing section, before E/O/W/C scoring and suggestions.
- **Rounds chart-check controls (v0.0.94 · 2026-09-07):** Rounds now has a direct Chart check add button beside Wound check, and expanded Rounds cards only delete from the top-right control while keeping the inline Chart check send action.
- **Nav order (v0.0.95 · 2026-09-07):** Calendar now sits before Day in the main list navigation.
- **Rounds worklists (v0.0.96 · 2026-09-07):** Chart checks now live in a dedicated Rounds list above wound checks instead of the Board, wound-check rows include rounds-style major task controls, and list removals use a right-side X control.
- **Top-right removal controls (v0.0.97 · 2026-09-07):** card/list removal controls now sit at the top-right across Board, Rounds, SO Board, Calendar, Scheduled, Closed, Chart Check, Wound Check, and Trash views; Chart Checks are hidden from Calendar as well as the Board.
- **Rounds notes save (v0.0.98 · 2026-09-08):** expanded Rounds cards now include an explicit Save notes button while keeping the existing autosave-as-you-type behavior.
- **Rounds check dots (v0.0.99 · 2026-09-08):** tapping rounds checkmarks or chart-check dots now marks the dot only and keeps the patient visible instead of auto-archiving until the next round.
- **Finished-task sync guard (v0.0.100 · 2026-09-09):** completed Board/Rounds/SO to-dos now carry per-task completion memory and merge timestamps, so stale linked Rounds text or another device's older unchecked copy does not make finished tasks reappear on the Board.
- **Board to Rounds push (v0.0.101 · 2026-09-09):** expanded Board cards now have a direct Rounds button that creates or updates the matching Rounds patient by room/name, links the card, and syncs open to-dos without duplicating completed work.
- **Temporary ED consult identity (v0.0.102 · 2026-09-09):** consults can temporarily use `ED`/`ER` without a patient name or exact bay; generic ED matching now requires the handoff/problem fingerprint to match, so different ED handoffs stay separate.
- **Tethered cord sign-out (v0.0.103 · 2026-09-09):** SO now includes a dedicated Tethered cord preset and auto-detection, ordered as exam, urinary/bowel status, PT status, IV meds, then other dispo barriers.
- **Optional POD sign-out box (v0.0.104 · 2026-09-09):** every SO template now offers an optional POD add-on box; when enabled it appears in the SO editor, SO board, copied report, and present mode.
- **SSI/wound sign-out (v0.0.105 · 2026-09-09):** SO now includes a dedicated surgical-site infection/wound template built from the local infection, wound-culture, washout/PRS, and incision-care references, with SSI auto-detection and compact SO board boxes.
- **Optional pre-op sign-out status (v0.0.106 · 2026-09-09):** every SO template now offers a Pre-op status add-on for what is done versus not done, covering consent, booking/case request, NPO, labs/T&S, H&P/pre-op note, DVT hold, and postop bed.
- **SO board render restore (v0.0.107 · 2026-09-09):** SO board rendering now normalizes stale/missing template keys to General and isolates malformed cards so one bad sign-out item cannot blank the whole board.
- **Wound checks** can be taken off the list from the row (**✕ Remove from wound list**) or via the card's Wound list button, both undoable.
- Any task card (consent, comm, proc…) with nothing outstanding now shows its **Done** button.
- **Rounds rounds-schedule:** ticking a check only fills the dot and keeps the patient visible on the list. **Reset seen ✓ (AM)** clears every check and any manual archives for a new day. Archived patients, if any, sit in their own collapsible section showing when each comes back; tap a row (or **↩ Bring all back**) to pull one forward early. Day view keeps the 3-stage version (AM seen · 1 pm · 4 pm). Rounds always open compact after a reload.
- **Rounds — the far-right button** is the stage control: it names the next check owed (`✓ 1p chart`), and tapping it ticks that stage and archives the patient until the next scheduled round. The dots on each row keep the running record of which stages are done. Tap the `◷ 2h 14m` timer to bring a patient back early, or `✓ 5/5` to reopen the last check.

- **SO Board:** mark **SO** on a Rounds patient. Each card uses the selected SO template, with high-value boxes, **To-Dos**, and **Notes**; compact mode keeps priority boxes, the next to-do, and a notes preview. **Δ Changes** highlights new/current changed words in yellow; removed words are not shown. Negations and absence terms (no, denies, afebrile, WNL, NKDA…) render in green whether or not diffing is on; tap a card's **Δn ✕** badge to restart that card's tracking from a clean slate, or **Δ Reset all** for the whole list (both undoable). To-dos carry board-style timers, each card can be flipped Expand/Compact on its own, and removal is via **✕** (desktop) or left swipe (phone).
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
