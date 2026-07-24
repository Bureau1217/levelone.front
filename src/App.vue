<template>

  <vue-easy-lightbox
      :visible="easyLightBoxImage !== null"
      :imgs="easyLightBoxImage"
      @hide="store.commit('removeEasyLightBoxImage')"
      @contextmenu="preventContextMenu($event)"
  ></vue-easy-lightbox>

  <div
      v-if="store.getters.appLockStatus === 'waiting'"
      class="v-app v-app__loader"
  >

  </div>
  <div
      v-else
      class="v-app"
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
import {useStore} from "vuex"
import {key} from "@/store"
import VueEasyLightbox from 'vue-easy-lightbox'

export default defineComponent({
  name: 'App',

  data() {
    return {
      store: useStore(key),
    }
  },

  components: {
    AppFooter,
    NavigationApp,
    VueEasyLightbox,
  },

  methods: {
    preventContextMenu(e: MouseEvent) {
      e.preventDefault()
    }
  },

  computed: {
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
