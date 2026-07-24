<template>
  <section class="v-section-calibre">
    <div class="v-section-calibre__inner">

      <div class="v-section-calibre__left">

        <div class="v-section-calibre__text">
          <h2 class="v-section-calibre__title">Calibre Mécanique</h2>
          <hr class="v-section-calibre__divider">
          <p class="v-section-calibre__body">
            Mouvement Manufacture FM01 — première utilisation en horlogerie entièrement fabriqué et usiné à l'interne.
            Le développement de ce mouvement a une logique pour une solution durable, des assortiments de transmissions
            et d'échappement NIHS, universalité de l'assemblage, réparabilité sans limite de temps.
          </p>
          <hr class="v-section-calibre__divider">
          <p class="v-section-calibre__body">28'800 alternances / heure (4 Hertz)</p>
          <hr class="v-section-calibre__divider">
          <p class="v-section-calibre__body">
            Décorations Côtes de Genève, soit selon les 7 côtes hommages au 7 plumes de l'aigle du drapeau genevois.
            Micro-perlage platine sus et sous.
          </p>
          <hr class="v-section-calibre__divider">
        </div>

        <!-- Timer indicators — 20% gap below text -->
        <div class="v-section-calibre__timers">
          <button
              v-for="(_, i) in images"
              :key="i"
              class="v-section-calibre__timer"
              :aria-label="`Slide ${i + 1}`"
              @click="goToSlide(i)"
          >
            <svg class="v-section-calibre__timer-svg" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <!-- background track -->
              <circle class="v-section-calibre__timer-track" cx="19" cy="19" r="16"/>
              <!-- clockwise fill -->
              <circle
                  class="v-section-calibre__timer-fill"
                  cx="19" cy="19" r="16"
                  :style="circleStyle(i)"
              />
              <!-- slide number -->
              <text
                  class="v-section-calibre__timer-num"
                  x="19" y="19"
                  dy="0.35em"
                  text-anchor="middle"
              >{{ i + 1 }}</text>
            </svg>
          </button>
        </div>

      </div>

      <div class="v-section-calibre__gap"></div>

      <div class="v-section-calibre__media">
        <transition name="v-calibre-fade" mode="out-in">
          <img
              :key="currentSlide"
              :src="images[currentSlide]"
              alt=""
              class="v-section-calibre__img"
          >
        </transition>
      </div>

      <div class="v-section-calibre__spacer"></div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// r=16 → circumference = 2π×16
const CIRCUMFERENCE = 2 * Math.PI * 16
const SLIDE_DURATION = 4000 // ms per slide

export default defineComponent({
  name: 'SectionCalibre',

  data() {
    return {
      images: [
        '/img/figma/specifications/spec-movement-photo.png',
        '/img/figma/specifications/spec-movement-photo.png',
        '/img/figma/specifications/spec-movement-photo.png',
      ],
      currentSlide: 0,
      progress: 0,
      lastTs: 0,
      rafId: 0,
    }
  },

  mounted() {
    this.rafId = requestAnimationFrame(this.tick)
  },

  beforeUnmount() {
    cancelAnimationFrame(this.rafId)
  },

  methods: {
    tick(ts: number) {
      if (this.lastTs) {
        this.progress += (ts - this.lastTs) / SLIDE_DURATION
        if (this.progress >= 1) {
          this.progress = 0
          this.currentSlide = (this.currentSlide + 1) % this.images.length
        }
      }
      this.lastTs = ts
      this.rafId = requestAnimationFrame(this.tick)
    },

    goToSlide(i: number) {
      this.currentSlide = i
      this.progress = 0
      this.lastTs = 0
    },

    circleStyle(i: number): object {
      let offset: number
      if (i < this.currentSlide) {
        offset = 0                                      // completed: full
      } else if (i === this.currentSlide) {
        offset = CIRCUMFERENCE * (1 - this.progress)   // active: filling
      } else {
        offset = CIRCUMFERENCE                          // upcoming: empty
      }
      return { strokeDashoffset: offset }
    },
  },
});
</script>
