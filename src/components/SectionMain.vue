<template>
  <section class="v-section-main">

    <div class="v-section-main__hero">
      <img
          class="v-section-main__hero__watch"
          src="/img/figma/hero/hero-watch-macro.jpg"
          alt=""
      >
      <div class="v-section-main__hero__mark">
        <img
            class="v-section-main__hero__icon"
            src="/img/figma/hero/hero-icon.svg"
            alt="Nicolas Commergnat - Genève"
        >
      </div>
    </div>

    <div class="v-section-main__intro">
      <subsection
          style="text-align: left"
          styleOption="regular"
          title="Level One"
          :arrowNav="false"
      >
        <slot></slot>
      </subsection>
    </div>

    <!--
      Outer: N × 100vh — creates the scroll travel.
      Sticky inner: locks to viewport top for that entire range.
      BG images are stacked; each new one slides up from below to cover the previous.
      Frame is centered inside the sticky viewport, always present, same slide logic.
    -->
    <div
        class="v-section-main__showcase"
        ref="showcase"
        :style="{ height: bgImages.length * 100 + 'vh' }"
    >
      <div class="v-section-main__showcase__sticky">

        <img
            v-for="(img, i) in bgImages"
            :key="'bg-' + img"
            :src="img"
            alt=""
            class="v-section-main__showcase__bg-img"
            :style="bgImageStyle(i)"
        >

        <div class="v-section-main__showcase__frame">
          <img
              v-for="(img, i) in frameImages"
              :key="'frame-' + img"
              :src="img"
              alt=""
              class="v-section-main__showcase__frame__img"
              :style="frameImageStyle(i)"
          >
        </div>

      </div>
    </div>

    <div
        v-if="imageGallery && imageGallery.length"
        class="v-section-main__gallery"
    >
      <image-gallery :arrayOfImgData="imageGallery"/>
    </div>

  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageGallery from "@/components/ImageGallery.vue"
import Subsection from "@/components/Subsection.vue"
import {useStore} from "vuex"
import {key} from "@/store"
import {IApiImageData, IApiResonse_home} from "@/global/api"

export default defineComponent({
  name: 'SectionMain',

  components: {
    Subsection,
    ImageGallery
  },

  data() {
    return {
      store: useStore(key),

      // Full-bleed background slides
      bgImages: [
        '/img/figma/main-slider/stack-1-wrist.jpg',
        '/img/figma/main-slider/stack-2-movement.jpg',
        '/img/figma/main-slider/stack-3-suit.jpg',
      ],

      // Small centered frame above the slides
      frameImages: [
        '/img/figma/slider/1.png',
        '/img/figma/slider/2.png',
        '/img/figma/slider/3.png',
      ],

      // Viewports scrolled into the showcase section: 0 → N-1
      scrolledVh: 0,
    }
  },

  computed: {
    imageGallery(): null | IApiImageData[] {
      if (this.store.state.homeData === null || !('slider' in this.store.state.homeData)) return null
      return (this.store.state.homeData as IApiResonse_home).slider
    },
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

    // Image i starts at translateY(i×100vh) and slides to 0 as scrolledVh reaches i
    bgImageStyle(i: number) {
      const offset = Math.max(0, i - this.scrolledVh) * 100
      return {
        transform: `translateY(${offset}vh)`,
        zIndex: i + 1,
      }
    },

    // Same logic as BG, scaled to frame height
    frameImageStyle(i: number) {
      const offset = Math.max(0, i - this.scrolledVh)
      return {
        transform: `translateY(calc(${offset} * clamp(188px, 29.9vw, 430px)))`,
        zIndex: i + 1,
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.v-section-main {
  width: 100%;
  position: relative;
}

.v-section-main__hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--color--black);
  height: 100vh;
  box-sizing: border-box;
  margin-top: calc( var(--navigation-height) * -1 );
}

.v-section-main__hero__watch {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90%;
  object-fit: cover;
  object-position: center top;
  mask-image: linear-gradient(to bottom, transparent 0%, black 30%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 30%);
  z-index: 1;
}

.v-section-main__hero__mark {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.v-section-main__hero__icon {
  display: block;
  width: clamp(180px, 22vw, 320px);
  height: auto;
  user-select: none;
}

.v-section-main__intro {
  position: relative;
  background-color: var(--color--light);
  padding-top: 10%;
  padding-bottom: 10%;

  :deep(.v-subsection) {
    padding-top: 0;
    padding-bottom: 0;
  }

  :deep(.v-subsection__content__title) {
    font-size: calc(var(--font-size) * 2);
    line-height: calc(var(--line-height) * 2);
    font-weight: 400;
    margin-top: 0;
    margin-bottom: calc(var(--line-height) * 1);
  }
}

// Outer: height comes from inline style (N × 100vh)
.v-section-main__showcase {
  position: relative;
}

// Sticky viewport: remains at top of screen throughout the showcase scroll range
.v-section-main__showcase__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color--black);
}

// Full-bleed images: absolutely stacked, each slides up from below
.v-section-main__showcase__bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

// Frame: centered inside the sticky viewport, clips its images
.v-section-main__showcase__frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(280px, 44.5vw, 641px);
  height: clamp(188px, 29.9vw, 430px);
  overflow: hidden;
  z-index: 100;
  pointer-events: none;
}

// Frame images: absolutely stacked, slide in sync with BG images
.v-section-main__showcase__frame__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  will-change: transform;
}

.v-section-main__gallery {
  width: 100%;
}
</style>
