<template>
  <nav
      class="v-navigation-app"
      :class="{'hide': hide}"
  >

    <div
        class="v-navigation-app__top"
    >

      <router-link
          class="v-navigation-app__top__brand"
          :to="{path: '/', hash: '#v-home__main'}"
      >level one</router-link>

      <div
          @click="toggleMenu"
          class="v-navigation-app__top__toggle-menu"
      >
        <div>
          <svg
              v-if="store.state.menuOpen"
              version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 213.8 213.8"
              style="enable-background:new 0 0 213.8 213.8;"
              xml:space="preserve"
          >
            <polygon
                points="213.8,23.8 190.1,0 106.9,83.2 23.8,0 0,23.8 83.2,106.9 0,190.1 23.8,213.8 106.9,130.7 190.1,213.8 213.8,190.1 130.7,106.9 "/>
          </svg>
          <svg
              v-else
              version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 268.8 212.8"
              style="enable-background:new 0 0 268.8 212.8;"
              xml:space="preserve"
          >
            <g>
              <path d="M0,0v33.6h268.8V0H0z M0,89.6v33.6h268.8V89.6H0z M0,179.2v33.6h268.8v-33.6H0z"/>
            </g>
          </svg>
        </div>
      </div>

    </div>

    <div
        class="v-navigation-app__bottom"
    >
      <div class="v-navigation-app__bottom__group">
        <router-link :to="{path: '/', hash: '#v-home__main'}">level one</router-link>
        <router-link :to="{path: '/', hash: '#v-home__specification'}">spécifications</router-link>
        <router-link :to="{path: '/', hash: '#v-home__bio'}">a propos</router-link>
      </div>

      <div class="v-navigation-app__bottom__group">
        <router-link to="/certification">certificats</router-link>
        <router-link class="v-navigation-app__bottom__cta" to="/pre-order">précommander</router-link>
      </div>
    </div>

  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useStore} from "vuex"
import {key} from "@/store"

export default defineComponent({
  name: 'NavigationApp',
  components: {
  },

  data() {
    return {
      hide: false,

      store: useStore(key)
    }
  },

  mounted() {
    const scrollValueToHideNav = 100;
    let holdScrollValue = 0

    window.addEventListener("scroll", (e) => {
      if      (window.scrollY > scrollValueToHideNav && holdScrollValue < window.scrollY) this.hide = true
      else if (holdScrollValue > window.scrollY && window.scrollY > scrollValueToHideNav) this.hide = false
      holdScrollValue = window.scrollY
    })
  },

  methods: {
    toggleMenu() {
      this.store.commit("toggleMenu")
    }
  },

});
</script>

<style lang="scss" scoped>
.v-navigation-app {
  position: relative;
  width: 100%;
  // Hauteur épinglée sur la même variable que la réserve de `.v-app` : plus jamais
  // d'écart entre la nav et ce qui suit (le fond noir de la nav rejoint directement
  // celui de la photo hero, sans bande blanche entre les deux).
  height: var(--navigation-height);
  box-sizing: border-box;
  background-color: var(--color--black);
  color: var(--color--light);

  .menu-open & {
    height: 100%;
  }
}

.v-navigation-app__top {
  position: relative;
  z-index: 10;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-left: var(--gutter);
  padding-right: var(--gutter);

  @media all and (min-width: 950px) {
    display: none;
  }
}

.v-navigation-app__top__brand {
  font-family: MB_Picture_House_One_Light, sans-serif;
  font-size: calc( var(--font-size) * 1.5 );
  text-decoration: none;
  color: var(--color--light);
}

.v-navigation-app__top__toggle-menu {
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  user-select: none;

  svg {
    display: block;
    height: 1rem;
    fill: var(--color--light);
  }
}

.v-navigation-app__bottom {
  position: relative;
  box-sizing: border-box;
  transform: translateY(0);
  z-index: 0;
  opacity: 1;
  display: none;

  .menu-open & {
    display: flex;
    height: calc(100% - var(--navigation-height));
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-size: calc( var(--font-size) * 2);
  }

  a {
    text-decoration: none;
    font-family: MB_Picture_House_One_Light, sans-serif;

    &:hover {
      color: var(--color--main)
    }
  }

  @media all and (min-width: 950px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    font-size: calc( var(--font-size) * 1.5 );
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }
}

.v-navigation-app__bottom__group {
  display: contents;

  @media all and (min-width: 950px) {
    display: flex;
    align-items: center;
    gap: calc( var(--gutter) / 2 );

    a {
      padding: var(--gutter--half);
    }
  }
}

.v-navigation-app__bottom__cta {
  @media all and (min-width: 950px) {
    text-decoration: underline;
  }
}

.v-navigation-app {
  transition: transform 500ms ease-in-out;
  transform: translateY(0);

  .v-navigation-app__top {
    transition: opacity 250ms 250ms ease-in-out;
    opacity: 1;
  }

  .v-navigation-app__bottom {
    transition: transform 500ms ease-in-out;
    transform: translateY(0);
  }

  &.hide {
    transform: translateY(-100%);

    .v-navigation-app__top {
      transition: opacity 250ms ease-in-out;
      opacity: 0;
    }

    .v-navigation-app__bottom {
      transition: transform 500ms ease-in-out;
      transform: translateY(100%);
    }
  }
}

</style>
