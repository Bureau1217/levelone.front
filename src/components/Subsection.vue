<template>
  <section class="v-subsection"
           :class="{
              'is-l': styleOption === 'large',
           }"
  >
    <div
         class="v-subsection__content v-subsection__content--centred lo-remove-child-margin lo-g-gutter--half"
    >
      <h1
          class="v-subsection__content__title lo-g-gutter--half"
          :class="{
            'title-variant': titleVariant
          }"
      >{{title}}</h1>
      <div
          class="v-subsection__content__slot"
          :class="{
            'is-stacked': stackSlides,
          }"
          ref="scrollContent"
          @scroll="onScrollInSlideContainer"
      >
        <slot></slot>
      </div>
    </div>

    <div
        class="v-subsection__ui-box"
        v-if="arrowNav"
    >
      <img class="v-subsection__ui--left" v-if="currentIndex > 0"  @click="slideInGallery('toLeft')"  src="../assets/ui/gallery-arrow-left__active.svg"    alt="">
      <img class="v-subsection__ui--left" v-else                   @click="slideInGallery('toLeft')"  src="../assets/ui/gallery-arrow-left__unactive.svg"  alt="">

      <img class="v-subsection__ui--right" v-if="isLastSlide"       @click="slideInGallery('toRight')" src="../assets/ui/gallery-arrow-right__unactive.svg" alt="">
      <img class="v-subsection__ui--right" v-else                   @click="slideInGallery('toRight')" src="../assets/ui/gallery-arrow-right__active.svg"   alt="">
    </div>

  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

export default defineComponent({
  name: 'Subsection',
  components: {
  },

  mounted() {
    this.$nextTick(() => {
      if( this.$refs.scrollContent instanceof HTMLElement)
        this.slideNumber = this.$refs.scrollContent.childElementCount
    })
  },

  data() {
    return {
      currentIndex: 0,
      slideNumber: 1,
    }
  },

  props:{
    styleOption: {
      type: String as PropType<"regular" | "large">,
      require: true,
      default: 'regular'
    },

    title: {
      type: String,
      require: true,
    },

    arrowNav: {
      type: Boolean,
      require: false,
      default: true,
    },

    titleVariant: {
      type: Boolean,
      require: false,
      default: false,
    },

    stackSlides: {
      type: Boolean,
      require: false,
      default: false,
    },
  },

  computed: {
    isLastSlide(): boolean {
      return this.currentIndex + 1 === this.slideNumber
    }
  },

  methods: {
    onScrollInSlideContainer(e: MouseEvent) {
      if( !(this.$refs.scrollContent instanceof HTMLElement) ) return

      const scrollLeft        = this.$refs.scrollContent.scrollLeft
      const imageGalleryWidth = this.$refs.scrollContent.getBoundingClientRect().width

      this.currentIndex = Math.floor( (scrollLeft + imageGalleryWidth / 2 ) / imageGalleryWidth )
    },

    slideInGallery(direction: 'toLeft' | 'toRight') {
      if( !(this.$refs.scrollContent instanceof HTMLElement) ) return

      let index = this.currentIndex

      switch (direction) {
        case "toLeft":
          index--
          if (index < 0) break
          this.$refs.scrollContent.scrollTo({
            left: index * this.$refs.scrollContent.getBoundingClientRect().width,
            behavior: 'smooth',
          })
          break
        case "toRight":
          index++
          if (index >= this.slideNumber) break
          this.$refs.scrollContent.scrollTo({
            left: index * this.$refs.scrollContent.getBoundingClientRect().width,
            behavior: 'smooth',
          })
      }
    },

  }

});
</script>

<style lang="scss" >
.v-subsection {
  margin: auto;
  max-width:      var(--max-width);
  padding-top:    var(--section-padding-top);
  padding-bottom: var(--section-padding-bottom);
}

.v-subsection__content__title {
  text-align: center;
  margin-bottom: 0;
}

.title-variant {
  font-family: var(--font-family);
  font-weight: 400;
}

.v-subsection.is-l {
  max-width: var(--max-width--lg);

  ul {
    padding: 0;
  }

  li {
    text-decoration: none;
    display: block !important;
    padding-left: 0;
  }
}

.v-subsection__content__slot {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  scroll-snap-type: x mandatory;
  align-items: start;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
}

// `position: sticky` ne fonctionne pas à l'intérieur d'un conteneur de scroll :
// la variante empilée doit donc abandonner le défilement horizontal, pas seulement le masquer.
.v-subsection__content__slot.is-stacked {
  display: block;
  overflow-x: visible;
  scroll-snap-type: none;
}

.v-subsection__ui-box {
  position: relative;
  margin-top: var( --gutter );
  width: 0;
  left: 50%;
}

.v-subsection__ui--left {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  padding-left: var(--gutter--half);
  padding-right: var(--gutter--half);
}

.v-subsection__ui--right {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  padding-left: var(--gutter--half);
  padding-right: var(--gutter--half);
}

</style>
