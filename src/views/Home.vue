<template>
  <div class="v-home">

    <section-main
        v-if="intro"
        id="v-home__main"
    ><div
        class="lo-g-gutter--half"
        v-html="intro.content"
    ></div></section-main>

    <section-calibre id="v-home__calibre" />
    <section-precommande id="v-home__precommande" />

<section-bio id="v-home__bio" />

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SectionMain from "@/components/SectionMain.vue"
import SectionBio from "@/components/SectionBio.vue"
import SectionCalibre from "@/components/SectionCalibre.vue"
import SectionPrecommande from "@/components/SectionPrecommande.vue"
import {IApiResonse_home__section} from "@/global/api"
import {useStore} from "vuex"
import {key} from "@/store"

export default defineComponent({
  name: 'Home',
  components: {
    SectionBio,
    SectionMain,
    SectionCalibre,
    SectionPrecommande,
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
