<template>
  <!--
  Pied de page (maquette Figma, frame 678:309) : bandeau bleu marine plein cadre,
  logo + texte à gauche, photo du bâtiment à droite, alignés en bas comme dans Figma.
  Reprend les mêmes tokens de marge/gouttière que le reste du site (--gutter, --max-width--lg)
  plutôt que les pixels bruts de Figma.
  -->
  <div class="app-footer">

    <div class="app-footer__content">

      <div class="app-footer__info lo-g-gutter--half">
        <img
            class="app-footer__mark"
            src="/img/figma/footer/footer-mark.svg"
            alt="Level One"
        >

        <div class="app-footer__text lo-remove-child-margin">
          <p class="app-footer__intro">Nicolas Commergnat, un maître horloger, une signature, un état d’esprit. Un homme au carrefour unique de l’Histoire des modèles les plus mythiques du monde et de la connaissance des développements les plus aboutis.</p>

          <div class="app-footer__address">
            <p>Alliance Genève Sàrl</p>
            <p>Rue des Alpes 15 – 1201 Genève</p>
            <a href="mailto:nicolas@commergnat.com?subject=Contact%20depuis%20le%20site%20commergnat.com">nicolas@commergnat.com</a>
          </div>

          <p class="app-footer__copyright">© 2022 tous droits réservés.</p>
        </div>
      </div>

      <div class="app-footer__photo lo-g-gutter--half">
        <img
            src="/img/figma/footer/footer-building.png"
            alt=""
        >
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'AppFooter',

  components: {},

});
</script>

<style lang="scss" scoped>
.app-footer {
  width: 100%;
  box-sizing: border-box;
  background-color: var(--color--footer-bg);
  color: var(--color--light);
  padding-top: calc( var(--gutter) * 2 );
  padding-bottom: calc( var(--gutter) * 2 );

  // Même respiration que l'espacement entre les autres sections, mesurée par rapport
  // à la largeur (comportement standard des marges CSS en %) plutôt qu'un chiffre fixe.
  margin-top: 15%;
}

.app-footer__content {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc( var(--gutter) * 2 );

  @media all and (min-width: 950px) {
    // Même marge gauche que `.v-section-precommande` et l'image de `.v-section-bio`
    // juste au-dessus, pour que le bloc de gauche (et le SVG) s'alignent avec eux.
    padding-left: 2%;
    padding-right: 2%;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.app-footer__info {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc( var(--gutter) * 2 );
  text-align: center;

  @media all and (min-width: 950px) {
    height: 100%;
    align-items: flex-start;
    justify-content: space-between;
    text-align: left;
    width: auto;
    // `.app-footer__content` porte déjà la marge de 2% à cette largeur : annuler
    // le demi-gouttière de `lo-g-gutter--half` pour que le SVG et le texte
    // s'alignent pile avec l'image de `.v-section-bio` juste au-dessus.
    padding-left: 0;
  }
}

.app-footer__mark {
  display: block;
  // Le SVG source n'a pas de ratio intrinsèque (width/height="100%" côté Figma) :
  // fixer les deux dimensions (ratio réel du viewBox, 50.51 x 54.56) plutôt que
  // "height: auto" évite la déformation.
  width: 2.5rem;
  height: 2.7rem;
  object-fit: contain;
  flex-shrink: 0;
}

.app-footer__text {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc( var(--gutter) * 2 );

  @media all and (min-width: 950px) {
    width: auto;
    max-width: 18rem;
  }
}

.app-footer__intro {
  font-size: 1rem;
  line-height: 1.5rem;
}

.app-footer__address {
  font-size: .8rem;
  line-height: 1.3rem;

  p {
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: underline;
  }
}

.app-footer__copyright {
  font-size: .7rem;
  opacity: .8;
}

.app-footer__photo {
  width: 100%;
  max-width: 21.6rem;
  box-sizing: border-box;
  flex-shrink: 0;

  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  @media all and (min-width: 950px) {
    width: 36%;
  }
}
</style>
