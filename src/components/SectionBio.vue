<template>
  <section
      class="v-section-bio"
      ref="componentElement"
  >
    <subsection
        :title="dataSlide.title"
        :styleOption="isSticky ? 'large' : 'regular'"
        :arrowNav="!isSticky"
        :stackSlides="isSticky"
    >

      <div
          v-if="isSticky"
          class="v-section-bio__sticky"
      >
        <div class="v-section-bio__sticky__media">
          <img
              v-if="stickyImage"
              :src="stickyImage.url"
              alt=""
          >
        </div>

        <div class="v-section-bio__sticky__slides">
          <div
              v-for="slide of dataSlide.slides"
              class="v-section-bio__slides v-section-bio__slides--stacked"
          >
            <h2 class="v-section-bio__slides__subtitle" >subtitle</h2>

            <img
                class="v-section-bio__slides__img"
                v-for="img of imagesOfSlide(slide)"
                :src="img.url"
                alt=""
            >

            <div
                class="v-section-bio__slides__content lo-remove-child-margin"
                v-html="slide.content"
            ></div>
          </div>
        </div>
      </div>

      <template v-else>
        <div
            v-for="slide of dataSlide.slides"
            class="v-section-bio__slides"
            :class="{half: Object.keys( slide.image ).length > 0}"
        >
          <h2 class="v-section-bio__slides__subtitle" >subtitle</h2>

          <img
              class="v-section-bio__slides__img"
              v-for="img of slide.image"
              :src="img.url"
              alt=""
          >

          <div
              class="v-section-bio__slides__content lo-remove-child-margin"
              v-html="slide.content"
          ></div>

        </div>
      </template>
    </subsection>

  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import Subsection from "@/components/Subsection.vue"
import {IApiImageData, IApiResonse_home__section, IApiSlide} from "@/global/api"

export default defineComponent({
  name: 'SectionBio',
  components: {
    Subsection
  },

  props: {
    dataSlide: {
      require: true,
      type: Object as PropType<IApiResonse_home__section>,
    },

    layout: {
      require: false,
      type: String as PropType<"default" | "sticky">,
      default: 'default',
    }
  },

  computed: {
    isSticky(): boolean {
      return this.layout === 'sticky'
    },

    // Le portrait n'a pas de place réservée dans la réponse de l'API : on prend la première
    // image rencontrée dans les slides, et `imagesOfSlide` la retire du flux pour éviter le doublon.
    stickyImage(): IApiImageData | null {
      for (const slide of this.dataSlide?.slides ?? []) {
        const images = Object.values(slide.image ?? {})
        if (images.length > 0) return images[0]
      }
      return null
    },
  },

  methods: {
    imagesOfSlide(slide: IApiSlide): IApiImageData[] {
      return Object.values(slide.image ?? {})
        .filter(img => img.url !== this.stickyImage?.url)
    },
  },

  mounted() {
    this.$nextTick (() => {

      if(! (this.$refs.componentElement instanceof HTMLElement) ) return
      const slides = this.$refs.componentElement.querySelectorAll('.v-section-bio__slides')

      for(const slide of slides) {
        const slideTitle          = slide.querySelector('.v-section-bio__slides__content')?.querySelector('h1')
        const slideTitleContainer = slide.querySelector('.v-section-bio__slides__subtitle') as HTMLElement

        if(slideTitle instanceof HTMLElement) {
          slideTitleContainer.innerText = slideTitle.innerText
          slideTitle.remove()
        } else {
          slideTitleContainer.remove()
        }

      }
    })

  }

});
</script>

<style lang="scss" scoped>
.v-section-bio {

}

.v-section-bio__slides {
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;

  > * {
    box-sizing: border-box;
    width: 100%;
    flex-shrink: 1;
    padding-left: var(--gutter--half);
    padding-right: var(--gutter--half);
  }

  &.half {

    > *:first-child {
      width: 50%;
      padding-bottom: var(--gutter);
    }
    > * {
      width: 100%;
    }

    @media all and (min-width: 950px) {
      > *:first-child,
      > * {
        width: 50%;
        padding-bottom: 0;
      }
    }
  }
}
.v-section-bio__slides__subtitle {
  width: 100% !important;
  text-align: center;
  margin: 0;
  margin-bottom: 1rem;
  color: var(--color--main);
  font-family: MB_Picture_House_One_Light, sans-serif;
  font-size:    calc( var(--font-size)    * 3 );
  line-height:  calc( var(--line-height)  * 2 );
}

/**
 image fixe à gauche, slides qui s'empilent au scroll à droite
*/

.v-section-bio__sticky {
  @media all and (min-width: 950px) {
    display: flex;
    align-items: flex-start;
  }
}

.v-section-bio__sticky__media {
  box-sizing: border-box;
  width: 100%;
  padding-left: var(--gutter--half);
  padding-right: var(--gutter--half);

  > img {
    display: block;
    width: 100%;
    height: auto;
  }

  @media all and (min-width: 950px) {
    width: 40%;
    flex-shrink: 0;
    position: sticky;
    top: calc( var(--navigation-height) + var(--gutter) );
  }
}

.v-section-bio__sticky__slides {
  width: 100%;

  @media all and (min-width: 950px) {
    width: 60%;
  }
}

.v-section-bio__slides--stacked {
  display: block;
  box-sizing: border-box;
  padding-top: var(--gutter);
  padding-bottom: var(--gutter);

  // Chaque slide vient recouvrir le précédent : sans fond opaque, les textes se superposeraient.
  background: var(--color--light);

  .v-section-bio__slides__subtitle {
    text-align: left;
  }

  .v-section-bio__slides__img {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: var(--gutter);
  }

  @media all and (min-width: 950px) {
    position: sticky;
    top: calc( var(--navigation-height) + var(--gutter) );
  }
}
</style>
