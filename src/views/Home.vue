<template>
  <div class="v-home">

    <section-main
        v-if="intro"
        id="v-home__main"
    ><div
        class="lo-g-gutter--half"
        v-html="intro.content"
    ></div></section-main>

    <section-bio
        v-if="('specification' in store.state.homeData)"
        id="v-home__specification"
        :dataSlide="store.state.homeData.specification"
    />

    <section-bio
        v-if="('biographie' in store.state.homeData)"
        id="v-home__bio"
        layout="sticky"
        :dataSlide="store.state.homeData.biographie"
    />

    <section-talents
        id="v-home__talents"
    />

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SectionMain from "@/components/SectionMain.vue"
import SectionBio from "@/components/SectionBio.vue"
import SectionTalents from "@/components/SectionTalents.vue"
import {IApiResonse_home__section} from "@/global/api"
import {useStore} from "vuex"
import {key} from "@/store"

export default defineComponent({
  name: 'Home',
  components: {
    SectionTalents,
    SectionBio,
    SectionMain
  },

  data() {
    return {
      store: useStore(key),
    }
  },

  computed: {
    intro(): IApiResonse_home__section | null {
      if(this.store.state.homeData === null) return null
      if ('intro' in this.store.state.homeData) return this.store.state.homeData.intro
      return null
    },
  },

  // async beforeMount() {
  //   console.log( await apiGet('home') )
  // }

});
</script>

<style lang="scss" scoped>
.v-home {

}
</style>
