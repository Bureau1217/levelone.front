<template>
  <div class="v-loader" :class="{ 'is-dark': dark, 'is-out': leaving }">
    <div class="v-loader__bg"></div>
    <svg
        class="v-loader__svg"
        viewBox="0 0 1200 1200"
        fill="none"
    >
      <!-- Le cadran: the four rings trace themselves like a trim path. -->
      <circle
          class="v-loader__stroke"
          :cx="DIAL_OUTER.cx" :cy="DIAL_OUTER.cy" :r="DIAL_OUTER.r"
          :stroke-width="DIAL_OUTER.sw"
          :style="ringStyle(DIAL_OUTER.r, 'rim')"
      />
      <circle
          class="v-loader__stroke"
          :cx="DIAL_TRACK_INNER.cx" :cy="DIAL_TRACK_INNER.cy" :r="DIAL_TRACK_INNER.r"
          :stroke-width="DIAL_TRACK_INNER.sw"
          :style="ringStyle(DIAL_TRACK_INNER.r, 'trackA')"
      />
      <circle
          class="v-loader__stroke"
          :cx="DIAL_TRACK_OUTER.cx" :cy="DIAL_TRACK_OUTER.cy" :r="DIAL_TRACK_OUTER.r"
          :stroke-width="DIAL_TRACK_OUTER.sw"
          :style="ringStyle(DIAL_TRACK_OUTER.r, 'trackB')"
      />
      <circle
          class="v-loader__stroke"
          :cx="DIAL_CENTER.cx" :cy="DIAL_CENTER.cy" :r="DIAL_CENTER.r"
          :stroke-width="DIAL_CENTER.sw"
          :style="ringStyle(DIAL_CENTER.r, 'center')"
      />

      <!-- Everything else just appears once the cadran is closed. -->
      <g class="v-loader__stroke" :style="groupStyle('ticks')">
        <line
            v-for="(t, i) in DIAL_TICKS" :key="'tick'+i"
            :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
            :stroke-width="t.sw"
        />
      </g>

      <g class="v-loader__fill" :style="groupStyle('dots')">
        <circle
            v-for="(d, i) in DIAL_DOTS" :key="'dot'+i"
            :cx="d.cx" :cy="d.cy" :r="d.r"
        />
      </g>

      <g class="v-loader__fill" :style="groupStyle('numerals')">
        <template v-for="n in DIAL_NUMERALS" :key="n.hour">
          <path
              v-for="(d, pi) in n.paths" :key="pi"
              :d="d"
              fill-rule="evenodd"
          />
        </template>
      </g>
    </svg>

    <!-- Once the dial is gone: the nav logo appears black on white, turns
         white as the background goes black, then flies to its slot in the nav. -->
    <img
        class="v-loader__logo"
        :class="{ 'is-visible': logoVisible, 'is-sliding': logoTarget !== null, 'is-gone': logoGone }"
        :style="logoStyle"
        src="/img/figma/nav/nav-logo-mark.svg"
        alt=""
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  DIAL_OUTER, DIAL_TRACK_INNER, DIAL_TRACK_OUTER, DIAL_CENTER,
  DIAL_TICKS, DIAL_DOTS, DIAL_NUMERALS,
} from "@/global/dialLoaderData"

// ── Intro timeline (ms from mount) ───────────────────────────────────────
// 1. BLANK_HOLD    — pure background, nothing drawn
// 2. the cadran traces itself: outer rim, the two chapter rings chasing it,
//    then the centre pinion — trim-path draw-on, four elements only
// 3. POST_RING_GAP — a beat once the rim is closed
// 4. ELEM_START…   — ticks, then dots, then numerals simply fade in
// 5. FULL_HOLD     — the finished dial holds ~2s (waits here for the app too)
// 6. exit          — numerals/dots/ticks fade out, the rings un-draw
// 7. logo          — the nav logo fades in, black, centred on the white page
// 8. dark          — the background fades to black, the logo turns white
//    Once the background is fully black, the site fades in *underneath* it
//    ('reveal'), so nothing white can show through during the hand-off.
// 9. slide         — the logo flies up into its slot in the nav; meanwhile the
//    black background fades out over the (black) hero and the nav drops in
//    from above the screen ('leave', App.vue). The loader unmounts once the
//    logo has landed, and the nav's own logo takes over in the same spot.
const BLANK_HOLD    = 420
const RIM_DUR       = 900
const POST_RING_GAP = 320
const ELEM_START    = BLANK_HOLD + RIM_DUR + POST_RING_GAP

const RING_IN = {
  rim:    { delay: BLANK_HOLD,       dur: RIM_DUR },
  trackA: { delay: BLANK_HOLD + 220, dur: 650 },
  trackB: { delay: BLANK_HOLD + 290, dur: 650 },
  center: { delay: BLANK_HOLD + 540, dur: 480 },
}
const GROUP_IN = {
  ticks:    { delay: ELEM_START,       dur: 440 },
  dots:     { delay: ELEM_START + 130, dur: 440 },
  numerals: { delay: ELEM_START + 280, dur: 560 },
}
const DRAW_END = GROUP_IN.numerals.delay + GROUP_IN.numerals.dur
const FULL_HOLD = 2000

// Exit is the mirror image: fills first, rings last.
const GROUP_OUT = {
  numerals: { delay: 0,   dur: 300 },
  dots:     { delay: 80,  dur: 300 },
  ticks:    { delay: 160, dur: 300 },
}
const RING_OUT = {
  center: { delay: 260, dur: 300 },
  trackA: { delay: 360, dur: 460 },
  trackB: { delay: 400, dur: 460 },
  rim:    { delay: 460, dur: 620 },
}
const OUT_TOTAL     = RING_OUT.rim.delay + RING_OUT.rim.dur

const LOGO_IN    = 500   // logo fade-in (black on white)
const LOGO_HOLD  = 700
const DARK_DUR   = 700   // white → black, logo black → white
const DARK_HOLD  = 150
const SLIDE_DUR  = 900   // logo flight to the nav
const REVEAL_LAG = 450   // site / nav start appearing this long into the flight
const REVEAL_DUR = 700   // keep in sync with the nav drop-in in App.vue

const EASE = 'cubic-bezier(.65,0,.35,1)'

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type RingRole = keyof typeof RING_IN
type GroupKind = keyof typeof GROUP_IN

export default defineComponent({
  name: 'AppLoader',

  props: {
    // true once the site has finished booting (auth check resolved). The
    // loader will not leave before both this AND its own hold have completed.
    appReady: { type: Boolean, default: false },
  },

  emits: ['reveal', 'leave', 'finished'],

  data() {
    return {
      DIAL_OUTER, DIAL_TRACK_INNER, DIAL_TRACK_OUTER, DIAL_CENTER,
      DIAL_TICKS, DIAL_DOTS, DIAL_NUMERALS,
      holdDone: false,
      phase: 'in' as 'in' | 'out',
      logoVisible: false,
      dark: false,
      logoTarget: null as null | { x: number, y: number, h: number },
      logoGone: false,
      leaving: false,
      timers: [] as number[],
    }
  },

  watch: {
    appReady() {
      this.tryLeave()
    },
  },

  mounted() {
    const holdAfter = prefersReducedMotion() ? 250 : DRAW_END + FULL_HOLD
    this.timers.push(window.setTimeout(() => {
      this.holdDone = true
      this.tryLeave()
    }, holdAfter))
  },

  beforeUnmount() {
    this.timers.forEach((t) => window.clearTimeout(t))
  },

  computed: {
    logoStyle(): Record<string, string> {
      if (!this.logoTarget) return {}
      return {
        left: `${this.logoTarget.x}px`,
        top: `${this.logoTarget.y}px`,
        height: `${this.logoTarget.h}px`,
      }
    },
  },

  methods: {
    tryLeave() {
      if (this.phase === 'out' || !this.holdDone || !this.appReady) return

      // Flipping the phase re-runs the style getters below: the fill groups
      // switch to fade-out, the rings to un-draw.
      this.phase = 'out'

      if (prefersReducedMotion()) {
        this.at(40, () => {
          this.leaving = true
          this.logoGone = true
          this.$emit('reveal')
          this.$emit('leave')
        })
        this.at(300, () => this.$emit('finished'))
        return
      }

      const logoAt  = OUT_TOTAL
      const darkAt  = logoAt + LOGO_IN + LOGO_HOLD
      const slideAt = darkAt + DARK_DUR + DARK_HOLD
      const revealAt = slideAt + REVEAL_LAG

      this.at(logoAt, () => { this.logoVisible = true })
      this.at(darkAt, () => { this.dark = true })
      this.at(darkAt + DARK_DUR, () => this.$emit('reveal'))
      this.at(slideAt, () => { this.slideLogo() })
      this.at(revealAt, () => {
        this.leaving = true
        this.$emit('leave')
      })
      this.at(Math.max(slideAt + SLIDE_DUR, revealAt + REVEAL_DUR), () => this.$emit('finished'))
    },

    at(ms: number, fn: () => void) {
      this.timers.push(window.setTimeout(fn, ms))
    },

    // Target = the nav's own logo. The nav is still translated off-screen at
    // this point (App.vue), so measure it relative to the nav itself — on load
    // the nav sits at the very top of the viewport. No visible nav logo (log
    // screen, mobile top bar): fly to the nav's centre and fade out instead.
    slideLogo() {
      const nav = document.querySelector('.v-app__nav')
      const mark = document.querySelector('.v-navigation-app__bottom__mark img')
      const navTop = nav ? nav.getBoundingClientRect().top : 0
      const rect = mark ? mark.getBoundingClientRect() : null

      if (rect && rect.width > 0) {
        this.logoTarget = {
          x: rect.left + rect.width / 2,
          y: rect.top - navTop + rect.height / 2,
          h: rect.height,
        }
      } else {
        const navHeight = nav ? (nav as HTMLElement).offsetHeight : 80
        this.logoTarget = { x: window.innerWidth / 2, y: navHeight / 2, h: navHeight * .6 }
        this.logoGone = true
      }
    },

    // --len / stroke-dasharray must be strings — Vue's style patcher drops
    // non-string values, and then `var(--len, …)` in the keyframe falls back
    // and the big rings render half-drawn instead of blank.
    ringStyle(r: number, role: RingRole) {
      const len = String(2 * Math.PI * r)
      const t = this.phase === 'out' ? RING_OUT[role] : RING_IN[role]
      const name = this.phase === 'out' ? 'v-loader-untrim' : 'v-loader-trim'
      return {
        '--len': len,
        strokeDasharray: len,
        animation: `${name} ${t.dur}ms ${EASE} ${t.delay}ms both`,
      }
    },

    groupStyle(kind: GroupKind) {
      const t = this.phase === 'out' ? GROUP_OUT[kind] : GROUP_IN[kind]
      const name = this.phase === 'out' ? 'v-loader-vanish' : 'v-loader-appear'
      return { animation: `${name} ${t.dur}ms ease ${t.delay}ms both` }
    },
  },
})
</script>

<style lang="scss" scoped>
.v-loader {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000000;
}

.v-loader.is-out {
  pointer-events: none;
}

.v-loader__bg {
  position: absolute;
  inset: 0;
  background-color: var(--color--light, #fff);
  transition: background-color 700ms ease, opacity 600ms ease;

  .is-dark & {
    background-color: var(--color--black, #000);
  }

  .is-out & {
    opacity: 0;
  }
}

// The SVG is white (it's the nav's logo): brightness(0) renders it black on the
// white page, then it eases back to white as the background goes black.
.v-loader__logo {
  position: fixed;
  top: 50%;
  left: 50%;
  height: clamp(5rem, 14vw, 9rem);
  width: auto;
  transform: translate(-50%, -50%);
  opacity: 0;
  filter: brightness(0);
  pointer-events: none;
  user-select: none;
  transition:
      opacity 500ms ease,
      filter 700ms ease;

  &.is-visible { opacity: 1; }

  .is-dark & { filter: brightness(1); }

  &.is-sliding {
    transition:
        opacity 500ms ease 400ms,
        filter 700ms ease,
        top 900ms cubic-bezier(.65,0,.35,1),
        left 900ms cubic-bezier(.65,0,.35,1),
        height 900ms cubic-bezier(.65,0,.35,1);
  }

  &.is-gone { opacity: 0; }
}

.v-loader__svg {
  position: relative;
  width: min(46vw, 46vh, 320px);
  height: min(46vw, 46vh, 320px);
}

.v-loader__stroke {
  stroke: var(--color--black, #000);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.v-loader__fill {
  fill: var(--color--black, #000);
  stroke: none;
}

@media (prefers-reduced-motion: reduce) {
  .v-loader__bg { transition: opacity 200ms ease; }
  .v-loader__stroke,
  .v-loader__fill {
    animation: none !important;
  }
  .v-loader__stroke { stroke-dashoffset: 0 !important; }
}
</style>

<!-- NOT scoped: Vue rewrites @keyframes identifiers with the scope hash, but
     the animations are wired up from JS (ringStyle/groupStyle) with the bare
     names — a scoped keyframe would never match and nothing would animate. -->
<style lang="scss">
@keyframes v-loader-trim {
  from { stroke-dashoffset: var(--len, 4000); }
  to   { stroke-dashoffset: 0; }
}

@keyframes v-loader-untrim {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: var(--len, 4000); }
}

@keyframes v-loader-appear {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes v-loader-vanish {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>
