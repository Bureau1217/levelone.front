<template>

  <vue-easy-lightbox
      :visible="easyLightBoxImage !== null"
      :imgs="easyLightBoxImage"
      @hide="store.commit('removeEasyLightBoxImage')"
      @contextmenu="preventContextMenu($event)"
  ></vue-easy-lightbox>

  <app-loader
      v-if="loaderVisible"
      :app-ready="appReady"
      @leave="siteRevealed = true"
      @finished="loaderVisible = false"
  />
  <div
      class="v-app"
      :class="{ 'is-loading': !siteRevealed }"
  >

    <div
        v-if="!isLogView"
        class="v-app__nav"
    >
      <navigation-app/>
    </div>

    <router-view/>

    <app-footer
        v-if="!isLogView"
    ></app-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavigationApp from "@/components/NavigationApp.vue"
import AppFooter from "@/components/AppFooter.vue";
import AppLoader from "@/components/AppLoader.vue";
import {useStore} from "vuex"
import {key} from "@/store"
import VueEasyLightbox from 'vue-easy-lightbox'

export default defineComponent({
  name: 'App',

  data() {
    return {
      store: useStore(key),
      // The intro loader owns its own timeline; it stays mounted over the app
      // until its choreography finishes AND the app is ready, then crossfades.
      loaderVisible: true,
      siteRevealed: false,
    }
  },

  components: {
    AppFooter,
    NavigationApp,
    VueEasyLightbox,
    AppLoader,
  },

  methods: {
    preventContextMenu(e: MouseEvent) {
      e.preventDefault()
    }
  },

  computed: {
    appReady(): boolean {
      return this.store.getters.appLockStatus !== 'waiting'
    },

    isLogView(): boolean {
      return this.$route.name === 'Log'
    },

    easyLightBoxImage(): string | null {
      return this.store.state.easyLightBoxImage
    }
  }

});
</script>

<style lang="scss" scoped>
.v-app {
  opacity: 1;
  transition: opacity 600ms ease;
}

.v-app.is-loading {
  opacity: 0;
}

.v-app__nav {
  position: relative;
  width: 100%;
  z-index: 1000000;

  .menu-open & {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
  }
}
</style>
