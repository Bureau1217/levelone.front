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
      @reveal="siteRevealed = true"
      @leave="navDropped = true"
      @finished="loaderVisible = false"
  />
  <div
      class="v-app"
      :class="{
        'is-loading': !siteRevealed,
        'is-nav-up': !navDropped,
        'is-intro': loaderVisible && !isLogView,
      }"
  >

    <div
        v-if="!isLogView"
        class="v-app__nav"
        :class="{ 'is-intro': loaderVisible }"
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
      navDropped: false,
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

// While the nav is still up off-screen (or dropping in), its empty slot would
// show the white page background above the (black) hero: paint it black until
// the intro is over and the nav has landed.
.v-app.is-intro {
  background-color: var(--color--black);
}

.v-app__nav {
  position: relative;
  width: 100%;
  z-index: 1000000;
  // Intro: the nav drops in from above the screen once the loader hands over
  // (duration kept in sync with REVEAL_DUR in AppLoader.vue).
  transition: transform 700ms cubic-bezier(.65,0,.35,1);

  .is-nav-up & {
    transform: translateY(-100%);
  }

  // The loader's logo flies into this exact slot; the nav's own logo only
  // shows once the loader is gone, so the hand-off is seamless.
  &.is-intro :deep(.v-navigation-app__bottom__mark img) {
    visibility: hidden;
  }

  .menu-open & {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
  }
}
</style>
