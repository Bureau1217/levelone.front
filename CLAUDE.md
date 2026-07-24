# level-one frontend — notes for Claude

Vue 3 (Options API) + TypeScript + Vuex + vue-router (hash history) + SCSS,
built with `vue-cli-service` (not Vite). Password-gated marketing site for
watchmaker Nicolas Commergnat.

## Running it locally

- Node version is pinned via `.nvmrc` to **v12.18.3**. `nvm use` fails
  silently in this harness's Bash tool (exits 3, prints nothing) — instead
  prepend the version's bin dir directly:
  `export PATH="$HOME/.nvm/versions/node/v12.18.3/bin:$PATH"`
- `npm run serve` → http://localhost:8080

## The frontend does NOT talk to the local backend

`src/global/variables.ts` hardcodes `API_URL = "https://api.commergnat.com/"`
— the **live production API**, not the sibling `levelone.back` Kirby CMS repo.
Running `levelone.back` locally has no effect on what this frontend renders;
only relevant if `API_URL` is ever repointed to localhost. `levelone.back`'s
`site/content/` is gitignored and empty in a fresh checkout anyway.

## Auth gate blocks local viewing

The whole site sits behind a password lock screen (`views/Log.vue` +
`FormLockedPage.vue`), driven by `store.getters.appLockStatus` (`'waiting' |
'lock' | 'unlock'`). Without valid CMS credentials you can't reach `Home.vue`
normally.

**To visually QA changes locally**, temporarily replace the guard in
`src/main.ts` with an unconditional `next()`:
```ts
router.beforeEach((to, _from, next) => {
  next() // TEMP: local visual QA, reverted before handoff
  store.commit("closeMenu")
})
```
**Always revert to the real guard before finishing** — this is the original,
put it back exactly:
```ts
router.beforeEach((to, _from, next) => {

  if(store.getters.appLockStatus === 'unlock') {
    next()
  }
  else {
    if(to.name !== 'Log') router.push({name: 'Log'})
    else next()
  }

  store.commit("closeMenu")

})
```
After many hot-reload cycles Vue can throw `Cannot read properties of null
(reading 'emitsOptions')` — that's stale HMR state, not a real bug; fix with
a hard reload (`location.reload(true)`), not more edits.

## Site architecture: static sections vs legacy CMS sections

Ongoing redesign is replacing CMS-driven sections with hardcoded ones that
match Figma specs pixel-for-pixel:

- **Static, no CMS props**: `SectionHero`, `SectionIntro`, `SectionCalibre`,
  `SectionPrecommande`, `SectionShowcase`, `SectionBio`. Styles for most of
  these live in `src/styles/sections.scss` (SectionBio keeps its own scoped
  `<style>` block instead).
- **Still CMS-driven**: `SectionMain` (wraps Hero/Intro/Showcase, gated by
  `intro` from `store.state.homeData`), `SectionTalents` was deleted
  (no longer used) — if resurrecting it, check `IApiResonse_home__section`
  in `global/api.ts` still matches.
- Left-margin convention: **2% left padding**, shared by
  `.v-section-precommande`, the bio section's sticky image column, and the
  footer's left content block (`AppFooter.vue`) — they're intentionally kept
  in sync; if you change one, check the other two.
- Nav (`NavigationApp.vue` / `App.vue`) is **not** `position: fixed` — it
  scrolls away normally. It only becomes `position: fixed` (full-screen) when
  `.menu-open` is set, for the mobile hamburger overlay. There's no
  hide-on-scroll JS anymore (removed).

## `position: sticky` stacking-cards technique (SectionBio)

`SectionBio.vue` implements a "next card slides up and covers the previous"
scroll effect for both the text column and the synced left photo column.
Hard-won findings, empirically verified in Chrome — don't relitigate these:

1. **A sticky element's scroll "dwell" room comes only from real DOM
   siblings that follow it inside the same direct parent.** `padding-bottom`
   on the parent does **not** give a last/only sticky child any dwell time —
   confirmed by direct experiment, contradicts the naive mental model. Always
   add a trailing spacer **element**, never rely on parent padding.
2. To scroll-sync two independent sticky stacks (e.g. text cards vs. photo
   cards), give matching segments the **same flow height**. Measure text
   height with `ResizeObserver`, not a one-shot `mounted()` read — webfonts
   reflow content after mount and a static measurement will drift.
3. Sticky positioning alone does **not** hide a later sibling that happens to
   already be within the viewport while it's not yet "its turn" — nothing
   stops it from painting at its natural flow position. To get "only the
   current one visible, next one slides in exactly on cue," you need an
   explicit scroll-driven `transform: translateY()`, computed continuously
   from scroll position vs. cumulative boundary heights.
4. Working pattern for "N images, same fixed size, each slides up to cover
   the previous, reversible": **one** `position: sticky; overflow: hidden`
   window sized to the first image, with all images absolutely stacked
   inside it (`position: absolute; inset: 0`), each with a continuously
   scroll-computed `translateY`. Don't give each image its own sticky
   wrapper sized to its own content — that reintroduces both the
   "peeking" bug and inconsistent image sizes.

## TypeScript / tooling quirks

- This TS version (~4.1.5) has **no `ResizeObserver` DOM type**. Access via
  `(window as any).ResizeObserver` and type instances as `any`.
- `noUnusedParameters`-style checks are active; prefix intentionally-unused
  function params with `_` (e.g. `(to, _from, next)`).
- The browser automation `resize_window` tool does not actually change
  `window.innerWidth` in this environment — can't test mobile breakpoints by
  resizing the automated browser; verify mobile CSS by reading the compiled
  stylesheet rules instead (`document.styleSheets`).
