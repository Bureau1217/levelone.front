<template>
  <div class="v-pre-order">

    <!--
    header : photo plein cadre (la maquette Figma n'a pas de hero sur cette page, mais on
    reprend la même image que le hero de l'accueil pour garder une cohérence de marque, à la
    demande du client). Même technique que le hero de Certificats : la nav (transparente ici
    aussi) se superpose directement à la photo.
    -->
    <div
        class="v-pre-order__hero"
        style="background-image: url('/img/figma/hero/hero-watch-macro.jpg')"
    ></div>

    <!--
    Page PRÉCOMMANDE (maquette Figma, node 727:277) : même gabarit que le formulaire de
    connexion de la page Certificats (intro à gauche, champs à droite, filets horizontaux
    sans cadre), plutôt que l'ancien style ".lo-form" (cadre arrondi, bouton plein).
    -->
    <div
        class="v-pre-order__form lo-g-gutter"
        v-if="status === 'show form' || status === 'sending data' "
        :class="{
          'is-sending-data': status === 'sending data'
        }"
    >
      <div class="v-pre-order__form__intro lo-remove-child-margin">
        <h1>{{preorderData.titleName.length > 0 ? preorderData.titleName : 'Précommander'}}</h1>
        <p>{{preorderData.description.length > 0 ? preorderData.description : 'Si vous désirez aquérir une montre Nicolas Commergnat.'}}</p>
      </div>

      <div class="v-pre-order__form__fields">
        <form
            class="v-pre-order__fields"
            ref="FormElement"
            autocomplete="off"
            @submit="formSubmit"
        >
          <!--
          "NOM / prénom" est un seul champ dans la maquette : gardé en deux champs (prénom / nom)
          côte à côte sur une même ligne pour ne pas casser l'API de contact qui attend les deux
          séparément, tout en respectant la ligne unique de la maquette.
          -->
          <div class="v-pre-order__row v-pre-order__row--split">
            <input autocomplete="off" v-model="firstname" type="text" name="firstname" placeholder="prénom" required>
            <span class="v-pre-order__row__sep">/</span>
            <input autocomplete="off" v-model="name"      type="text" name="name"      placeholder="nom" required>
          </div>

          <div class="v-pre-order__row">
            <input autocomplete="off" v-model="email" type="email" name="email" placeholder="Adresse e-mail" required>
          </div>

          <div class="v-pre-order__row">
            <input autocomplete="off" v-model="country" type="text" name="country" placeholder="votre pays">
          </div>

          <div class="v-pre-order__row">
            <input autocomplete="off" v-model="phoneNumber" type="tel" name="phone" placeholder="votre numéro de téléphone">
          </div>

          <div class="v-pre-order__row">
            <textarea autocomplete="off" v-model="message" name="message" rows="1" placeholder="votre message"></textarea>
          </div>

          <button
              class="v-pre-order__validate"
          ><span>envoyer votre demande</span><img src="/img/figma/certification/certification-arrow.svg" alt=""></button>
        </form>

        <div
            v-if="status === 'sending data' "
            class="v-pre-order__form__waiting-message"
        >Envois des informations en cours…</div>
      </div>
    </div>

    <div
        v-else-if="status === 'show response'"
        class="v-pre-order__response lo-g-gutter--half"
    >
      <h2>{{responseMassage}}</h2>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {IApiResponse_preorder} from "@/global/api"
import {useStore} from "vuex"
import {key} from "@/store"

export default defineComponent({
  name: 'PreOrder',

  components: {
  },

  data() {
    return {
      firstname: "",
      name: "",
      email: "",
      country: "",
      phoneNumber: "",
      message: "",

      status:  'show form' as 'show form' | 'sending data' | 'show response',

      responseMassage: null as string | null,

      store: useStore(key),
    }
  },

  computed: {
    preorderData(): IApiResponse_preorder {
      return {
        titleName:      this.store.state.preorderData?.titleName      || '',
        description:    this.store.state.preorderData?.description    || '',
        image:          this.store.state.preorderData?.image          || null,
      }
    }
  },

  methods: {

    async formSubmit(e: Event) {
      e.preventDefault()

      this.status = "sending data"

      const contactUrl = new URL('https://api.commergnat.com/contact?')

      contactUrl.searchParams.append('firstname', this.firstname)
      contactUrl.searchParams.append('name',      this.name)
      contactUrl.searchParams.append('email',     this.email)
      contactUrl.searchParams.append('country',   this.country)
      contactUrl.searchParams.append('phone',     this.phoneNumber)
      contactUrl.searchParams.append('message',   this.message)

      try {
        const response = await fetch(
            contactUrl.href,
            {
              method: 'POST',
            })

        const dataRespon = await response.json()

        window.setTimeout(() => {
          this.responseMassage = dataRespon.succes
          this.status           = 'show response'
        }, 5000)


      } catch {
        window.setTimeout(() => {
          this.responseMassage  = 'Erreur de connection, réesséyez…'
          this.status           = 'show response'
        }, 5000)
      }

    }

  },

});
</script>

<style lang="scss" scoped>
.v-pre-order {
  min-height: calc( 100vh - var(--navigation-height) - var(--footer-height) );
}

// Photo plein cadre, sans voile ni texte en surimpression (même traitement que
// .v-certification__hero) : remonte sous la nav fixe pour que la nav transparente
// puisse se superposer directement à l'image.
.v-pre-order__hero {
  width: 100%;
  box-sizing: border-box;
  height: 45vw;
  min-height: 16rem;
  max-height: 34rem;
  background-color: var(--color--grey);
  background-size: cover;
  background-position: center;
  margin-top: calc( var(--navigation-height) * -1 );
}

.v-pre-order__form {
  width: 100%;
  // Pas de max-width centré : les blocs gauche/droite s'alignent sur le même filet que
  // la nav (var(--gutter) via .lo-g-gutter), au lieu d'une colonne centrée avec sa
  // propre marge (ce qui créait un décalage visible avec les marges de la nav).
  box-sizing: border-box;
  padding-top: var(--section-padding-top);
  padding-bottom: var(--section-padding-bottom);
  display: flex;
  flex-direction: column;
  gap: calc( var(--gutter) * 2 );
  position: relative;

  &.is-sending-data {
    .v-pre-order__fields {
      transition: opacity 500ms;
      opacity: .25;
      user-select: none;
      pointer-events: none;
    }
  }

  @media all and (min-width: 950px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: calc( var(--gutter) * 4 );
  }
}

.v-pre-order__form__intro {
  width: 100%;

  p {
    max-width: 26rem;
  }

  @media all and (min-width: 950px) {
    width: 40%;
    flex-shrink: 0;
  }
}

.v-pre-order__form__fields {
  width: 100%;

  @media all and (min-width: 950px) {
    width: 55%;
  }
}

// Champs sans cadre, filet horizontal sous chaque ligne (même langage visuel que
// FormLockedPage.vue sur la page Certificats).
.v-pre-order__fields {
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (pointer: fine) {
    transition: opacity ease-in-out 250ms;
    opacity: .7;

    &:hover,
    &:focus-within {
      opacity: 1;
    }
  }
}

.v-pre-order__row {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  border-bottom: solid 1px var(--color--black);
  padding-top: var(--gutter--half);
  padding-bottom: var(--gutter);
  display: flex;
  align-items: flex-end;
  transition: border-color 200ms ease-in-out;

  // Champ sélectionné (focus) : filet doré, plus épais — norme UX standard pour
  // indiquer le champ actif, en plus de l'opacité déjà gérée sur .v-pre-order__fields.
  &:focus-within {
    border-bottom-color: var(--color--main);
    border-bottom-width: 2px;
  }

  // Champ rempli mais invalide (e-mail mal formé, champ requis laissé vide puis quitté) :
  // filet rouge — seulement une fois le champ quitté, pas pendant la frappe.
  &:has(input:not(:placeholder-shown):invalid:not(:focus)),
  &:has(textarea:not(:placeholder-shown):invalid:not(:focus)) {
    border-bottom-color: var(--color-danger);
  }

  // Coche : exclue ici du filet "prénom / nom" (.v-pre-order__row--split), qui a sa
  // propre règle plus bas — sinon la coche apparaîtrait dès qu'un seul des deux champs
  // est valide, sans attendre l'autre.
  &:not(.v-pre-order__row--split) {
    // Champ rempli et valide (une fois quitté, pour ne pas signaler une erreur pendant
    // la frappe) : petite coche à droite du filet.
    &:has(input:not(:placeholder-shown):valid),
    &:has(textarea:not(:placeholder-shown):valid) {
      &::after {
        content: "✓";
        position: absolute;
        right: 0;
        bottom: calc( var(--gutter) + .1rem );
        color: var(--color--main);
        font-size: var(--font-size);
        pointer-events: none;
      }
    }
  }
}

// Sur mobile, "prénom" et "nom" repassent en deux lignes pleine largeur, chacune avec son
// propre filet (la maquette ne montre qu'une seule ligne, mais côte à côte les deux champs
// n'ont pas la place de respirer sur un petit écran) : la ligne unique de la maquette
// n'apparaît qu'à partir du desktop.
.v-pre-order__row--split {
  border-bottom: none;
  padding-top: 0;
  padding-bottom: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 0;

  input {
    width: 100%;
    border-bottom: solid 1px var(--color--black);
    padding-top: var(--gutter--half);
    padding-bottom: var(--gutter);
    transition: border-color 200ms ease-in-out;

    &:focus {
      border-bottom-color: var(--color--main);
      border-bottom-width: 2px;
    }

    &:not(:placeholder-shown):invalid:not(:focus) {
      border-bottom-color: var(--color-danger);
    }
  }

  @media all and (min-width: 950px) {
    border-bottom: solid 1px var(--color--black);
    padding-top: var(--gutter--half);
    padding-bottom: var(--gutter);
    flex-direction: row;
    align-items: flex-end;
    gap: var(--gutter--half);

    // Coche affichée seulement quand prénom ET nom sont tous les deux valides et remplis.
    &:has(input:not(:placeholder-shown):valid):not(:has(input:placeholder-shown)):not(:has(input:invalid)) {
      &::after {
        content: "✓";
        position: absolute;
        right: 0;
        bottom: calc( var(--gutter) + .1rem );
        color: var(--color--main);
        font-size: var(--font-size);
        pointer-events: none;
      }
    }

    &:has(input:not(:placeholder-shown):invalid:not(:focus)) {
      border-bottom-color: var(--color-danger);
    }

    &:focus-within {
      border-bottom-color: var(--color--main);
      border-bottom-width: 2px;
    }

    input {
      width: 50%;
      border-bottom: none;
      padding: 0;

      &:focus {
        border-bottom-color: transparent;
      }
    }
  }
}

.v-pre-order__row__sep {
  display: none;
  color: var(--color--grey);
  padding-bottom: .2rem;

  @media all and (min-width: 950px) {
    display: inline;
  }
}

.v-pre-order__row input,
.v-pre-order__row textarea {
  width: 100%;
  flex-shrink: 1;
  box-sizing: border-box;
  border: none;
  background: none;
  padding: 0;
  border-radius: 0;
  resize: none;
  font-family: MB_Picture_House_One_Light, sans-serif;
  // Taille réduite (demande client — le texte des libellés/placeholders était trop
  // imposant) : reste plus petit sur mobile pour éviter que les libellés longs comme
  // "votre numéro de téléphone" ne débordent sur un petit écran.
  font-size: calc( var(--font-size) * 1.2 );
  line-height: calc( var(--line-height) * 1.5 );
  color: var(--color--black);
  text-transform: lowercase;

  @media all and (min-width: 950px) {
    font-size: calc( var(--font-size) * 1.8 );
  }

  &::placeholder {
    color: var(--color--black);
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
}

.v-pre-order__validate {
  align-self: flex-end;
  margin-top: var(--gutter);
  display: inline-flex;
  align-items: center;
  gap: var(--gutter--half);
  background: none;
  border: none;
  padding: 0;
  border-radius: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size);
  color: var(--color--black);

  span {
    text-decoration: underline;
  }

  img {
    display: block;
    width: 1.1rem;
    height: .96rem;
  }
}

.v-pre-order__form__waiting-message {
  padding-top: var(--gutter);
}

.v-pre-order__response {
  width: 100%;
  max-width: var(--max-width--lg);
  margin: auto;
  box-sizing: border-box;
  padding-top: calc( var(--navigation-height) + var(--section-padding-top) );
  text-align: center;
  min-height: calc(100vh - (var(--navigation-height) + calc( var(--gutter) * 12 )) );
}

</style>
