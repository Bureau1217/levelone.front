<template>
  <section class="v-section-main">

    <section-hero />

    <section-intro>
      <slot></slot>
    </section-intro>

    <section-showcase />

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
import { useStore } from 'vuex';
import { key } from '@/store';
import { IApiImageData, IApiResonse_home } from '@/global/api';
import ImageGallery from '@/components/ImageGallery.vue';
import SectionHero from '@/components/SectionHero.vue';
import SectionIntro from '@/components/SectionIntro.vue';
import SectionShowcase from '@/components/SectionShowcase.vue';

export default defineComponent({
  name: 'SectionMain',

  components: {
    ImageGallery,
    SectionHero,
    SectionIntro,
    SectionShowcase,
  },

  data() {
    return {
      store: useStore(key),
    }
  },

  computed: {
    imageGallery(): null | IApiImageData[] {
      if (this.store.state.homeData === null || !('slider' in this.store.state.homeData)) return null
      return (this.store.state.homeData as IApiResonse_home).slider
    },
  },
});
</script>
