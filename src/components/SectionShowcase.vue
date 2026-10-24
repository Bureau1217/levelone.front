<template>
  <div
      class="v-section-showcase"
      ref="showcase"
      :style="{ height: bgImages.length * 100 + 'vh' }"
  >
    <div class="v-section-showcase__sticky">

      <img
          v-for="(img, i) in bgImages"
          :key="'bg-' + img"
          :src="img"
          alt=""
          class="v-section-showcase__bg-img"
          :style="bgImageStyle(i)"
      >

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionShowcase',

  data() {
    return {
      bgImages: [
        '/img/figma/main-slider/stack-1-wrist.jpg',
        '/img/figma/main-slider/stack-2-movement.jpg',
        '/img/figma/main-slider/stack-3-suit.jpg',
      ],
      scrolledVh: 0,
    }
  },

  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onScroll()
  },

  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll() {
      const el = this.$refs.showcase as HTMLElement | undefined
      if (!el) return

      const scrolled = -el.getBoundingClientRect().top
      const maxScroll = el.offsetHeight - window.innerHeight
      this.scrolledVh = Math.max(0, Math.min(maxScroll, scrolled)) / window.innerHeight
    },

    // Each BG image stays at 0 until the next one slides up to cover it
    bgImageStyle(i: number) {
      const offset = Math.max(0, i - this.scrolledVh) * 100
      return {
        transform: `translateY(${offset}vh)`,
        zIndex: i + 1,
      }
    },
  },
});
</script>
