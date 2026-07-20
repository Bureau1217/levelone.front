<template>
  <div
      class="v-image-gallery"
  >
    <div
        class="v-image-gallery__box"
    >
      <img class="v-image-gallery__ui v-image-gallery__ui--left"
           src="/img/NC-ui-arrow_2-left.svg"
           alt="ui arrow left navigation"
           @click="onUserNavigate('toLeft')"
      />
      <img class="v-image-gallery__ui v-image-gallery__ui--right"
           src="/img/NC-ui-arrow_2-right.svg"
           alt="ui arrow right navigation"
           @click="onUserNavigate('toRight')"
      />

      <div
          class="v-image-gallery__imgs"
          ref="imageGallery"
          @scroll="onScrollInGallery"
      >
        <img v-for="imageData of arrayOfImgData" :key="imageData.url" :src="imageData.url" alt="">
      </div>
    </div>

    <div
        class="v-image-gallery__counter"
    >
      <button
          v-for="slideNumber in slideCount"
          :key="slideNumber"
          type="button"
          class="v-image-gallery__counter__item"
          :class="{'is-current': slideNumber - 1 === currentIndex}"
          :aria-label="`Afficher l'image ${slideNumber} sur ${slideCount}`"
          @click="onUserGoTo(slideNumber - 1)"
      >{{ slideNumber }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {IApiImageData} from "@/global/api"

// Silence à observer après le dernier événement de scroll pour considérer qu'un
// défilement programmatique est terminé — le navigateur n'émet aucun événement de fin.
const PROGRAMMATIC_SCROLL_END_MS = 200

export default defineComponent({
  name: 'ImageGallery',

  components: {
  },

  data() {
    return {
      currentIndex: 0,
      autoplayTimer: null as number | null,
      settleTimer: null as number | null,
      isProgrammaticScroll: false,
    }
  },

  props: {
    arrayOfImgData: {
      required: true,
      type: Object as PropType<IApiImageData[]>,
    },

    autoplayInterval: {
      required: false,
      type: Number,
      default: 5000,
    },
  },

  computed: {
    slideCount(): number {
      return Object.keys(this.arrayOfImgData).length
    },
  },

  mounted() {
    this.startAutoplay()
  },

  unmounted() {
    this.stopAutoplay()
    if (this.settleTimer !== null) window.clearTimeout(this.settleTimer)
  },

  methods: {

    startAutoplay() {
      if (this.slideCount < 2) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      this.autoplayTimer = window.setInterval(() => {
        this.goToIndex((this.currentIndex + 1) % this.slideCount)
      }, this.autoplayInterval)
    },

    stopAutoplay() {
      if (this.autoplayTimer === null) return
      window.clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    },

    onUserNavigate(direction: 'toLeft' | 'toRight') {
      this.stopAutoplay()
      this.slideInGallery(direction)
    },

    onUserGoTo(index: number) {
      this.stopAutoplay()
      this.goToIndex(index)
    },

    onScrollInGallery() {
      if( !(this.$refs.imageGallery instanceof HTMLElement) ) return

      const scrollLeft        = this.$refs.imageGallery.scrollLeft
      const imageGalleryWidth = this.$refs.imageGallery.getBoundingClientRect().width

      this.currentIndex = Math.floor( (scrollLeft + imageGalleryWidth / 2 ) / imageGalleryWidth )

      // Un scroll que nous n'avons pas déclenché vient forcément d'un glissement : l'utilisateur a pris la main.
      if (!this.isProgrammaticScroll) {
        this.stopAutoplay()
        return
      }

      // Tant que le défilement programmatique émet des événements, on repousse sa clôture.
      this.scheduleProgrammaticScrollEnd()
    },

    scheduleProgrammaticScrollEnd() {
      if (this.settleTimer !== null) window.clearTimeout(this.settleTimer)
      this.settleTimer = window.setTimeout(() => {
        this.isProgrammaticScroll = false
      }, PROGRAMMATIC_SCROLL_END_MS)
    },

    goToIndex(index: number) {
      if( !(this.$refs.imageGallery instanceof HTMLElement) ) return
      if (index < 0 || index >= this.slideCount) return

      this.isProgrammaticScroll = true
      this.scheduleProgrammaticScrollEnd()

      this.$refs.imageGallery.scrollTo({
        left: index * this.$refs.imageGallery.getBoundingClientRect().width,
        behavior: 'smooth',
      })
    },

    slideInGallery(direction: 'toLeft' | 'toRight') {
      this.goToIndex(direction === 'toLeft' ? this.currentIndex - 1 : this.currentIndex + 1)
    },

  },
});
</script>

<style lang="scss" scoped>
.v-image-gallery__box {
  position: relative;
  width: 100%;
  padding-top: 68%;
  border-top: solid 1px var(--color--main);
  border-bottom: solid 1px var(--color--main);
  box-shadow: black 0 0 0 0;
  background: var(--color--grey);

  @media all and (min-width: 1000px) {
    padding-top: 0;
    height: calc( 100vh - 5rem);
  }
}

.v-image-gallery__imgs {
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
}

.v-image-gallery__counter {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: var(--gutter--half);
  box-sizing: border-box;
}

.v-image-gallery__counter__item {
  display: block;
  background: none;
  border: none;
  border-radius: 0;
  min-width: 2em;
  padding: calc( var(--gutter--half) / 2 );
  font-family: inherit;
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: var(--color--dark);
  opacity: .35;
  transition: opacity .3s ease, color .3s ease;

  &:hover {
    opacity: .7;
  }

  &.is-current {
    opacity: 1;
    color: var(--color--main);
  }
}

.v-image-gallery__ui {
  position: absolute;
  top: 50%;
  height: 50px;
  cursor: pointer;
  z-index: 10;

  &.v-image-gallery__ui--left {
    left: var(--gutter--half);
  }

  &.v-image-gallery__ui--right {
    right: var(--gutter--half);
  }
}


</style>
