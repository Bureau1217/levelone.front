<template>
  <nav
      class="v-navigation-app"
      :class="{'hide': hide, 'is-transparent': isTransparentRoute && !scrolled}"
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
        <router-link :to="{path: '/', hash: '#v-home__calibre'}">spécifications</router-link>
        <router-link :to="{path: '/', hash: '#v-home__bio'}">a propos</router-link>
      </div>

      <router-link
          v-if="!isHomeRoute"
          :to="{path: '/', hash: '#v-home__main'}"
          class="v-navigation-app__bottom__mark"
      >
        <img src="/img/figma/nav/nav-logo-mark.svg" alt="Level One">
      </router-link>

      <div class="v-navigation-app__bottom__group v-navigation-app__bottom__group--right">
        <router-link to="/certification">certificat</router-link>
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
      scrolled: false,

      store: useStore(key)
    }
  },

  mounted() {
    const scrollValueToHideNav = 100;
    let holdScrollValue = 0

    window.addEventListener("scroll", (e) => {
      this.scrolled = window.scrollY > scrollValueToHideNav

      if      (window.scrollY > scrollValueToHideNav && holdScrollValue < window.scrollY) this.hide = true
      else if (holdScrollValue > window.scrollY && window.scrollY > scrollValueToHideNav) this.hide = false
      holdScrollValue = window.scrollY
    })
  },

  watch: {
    // La nav est un composant unique monté une seule fois pour toute la session (elle vit
    // dans App.vue, en dehors de <router-view/>) : sans ça, "hide"/"scrolled" gardaient leur
    // valeur de la page précédente au moment de changer de route, ce qui pouvait la faire
    // clignoter le temps que le nouveau scroll se stabilise. On la remet toujours visible et
    // à jour dès qu'on arrive sur une nouvelle page.
    '$route'() {
      this.hide = false
      this.$nextTick(() => {
        this.scrolled = window.scrollY > 100
      })
    }
  },

  computed: {
    // Sur la page CERTIFICATS, la nav est transparente et se superpose à la photo (maquette
    // Figma) tant qu'on est en haut de page ; elle redevient noire dès qu'on quitte la photo,
    // comme sur les autres pages.
    isTransparentRoute(): boolean {
      return this.$route.name === 'Certification' || this.$route.name === 'PreOrder'
    },

    // Le mark centré ne fait pas partie de la nav de la page d'accueil dans la maquette
    // (le logo y est déjà géant dans le hero) : on ne l'affiche que sur les autres pages.
    isHomeRoute(): boolean {
      return this.$route.name === 'Home'
    }
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
  transition: background-color 250ms ease-in-out;

  .menu-open & {
    height: 100%;
  }

  &.is-transparent {
    background-color: transparent;
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
    height: 100%;
    font-size: calc( var(--font-size) * 1.5 );
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }
}

.v-navigation-app__bottom__group {
  display: contents;

  // Trois colonnes de largeur égale (gauche / logo / droite), comme dans la maquette
  // (chaque colonne y a le même flex-grow) : ça centre vraiment le logo, pas juste
  // "space-between" qui décale le centre selon la largeur du texte de chaque côté.
  @media all and (min-width: 950px) {
    display: flex;
    align-items: center;
    gap: calc( var(--gutter) / 2 );
    flex: 1 0 0;

    a {
      padding: var(--gutter--half);
    }
  }
}

.v-navigation-app__bottom__group--right {
  @media all and (min-width: 950px) {
    justify-content: flex-end;
  }
}

.v-navigation-app__bottom__cta {
  @media all and (min-width: 950px) {
    text-decoration: underline;
  }
}

.v-navigation-app__bottom__mark {
  display: none;
  user-select: none;

  @media all and (min-width: 950px) {
    display: flex;
    flex: 1 0 0;
    align-items: center;
    justify-content: center;
  }

  img {
    display: block;
    // +35%, puis +25%, puis encore +25% (demandes client successives), par rapport aux
    // 1.6rem d'origine.
    height: 3.4rem;
    width: auto;
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
