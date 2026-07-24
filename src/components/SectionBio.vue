<template>
  <section class="v-section-bio">
    <div class="v-section-bio__sticky">

      <div
          class="v-section-bio__sticky__media"
          ref="mediaRef"
          :style="{ height: mediaTotalHeight ? mediaTotalHeight + 'px' : undefined }"
      >
        <div
            class="v-section-bio__sticky__media__window"
            :style="{ height: sectionHeights[0] ? sectionHeights[0] + 'px' : undefined }"
        >
          <div
              v-for="(img, i) in mediaImages"
              :key="img"
              class="v-section-bio__sticky__media__layer"
              :style="{ transform: `translateY(${revealOffset(i)}%)` }"
          >
            <img :src="img" alt="">
          </div>
        </div>
      </div>

      <div class="v-section-bio__sticky__content">
        <main class="v-bio-page">

          <section
              ref="section1Ref"
              class="v-bio-page__section"
          >
            <div class="v-bio-page__divider"></div>
            <div class="content-row">
              <h2>QUÊTE EXISTENTIELLE</h2>
              <div class="body-copy">
                <p>L’horloger Nicolas Commergnat, maîtrise la plus inaccessible des complications, la simplicité... Il est l’horloger attitré du célèbre commissaire-priseur Aurel Bacs (Bacs &amp; Russo pour Phillips). De cet établi-observatoire unique, il tutoie et répare les montres les plus légendaires du monde. En marge et pendant les ventes aux enchères, il pratique la langue des Fondamentaux de l’Horlogerie. Surnommé «restaurateur de l’impossible» Il dialogue avec les trésors du passé, les perles des Indépendants.</p>
                <p>Diplômé de l’École d’Horlogerie de Genève, Nicolas Commergnat fait ses premières armes sur les établis cabinotiers du maître Sven Andersen, co-fondateur de l’AHCI (Académie Horlogère des Créateurs Indépendants). Puis, tout en pratiquant l’enseignement de l’horlogerie, il invente, brevette et développe des complications originales et ludiques.</p>
              </div>
            </div>
          </section>

          <section
              ref="section2Ref"
              class="v-bio-page__section v-bio-page__section--tall"
          >
            <div class="v-bio-page__divider"></div>
            <div class="content-row">
              <h2>L’AUTORITÉ DU<br>DÉPOUILLEMENT</h2>
              <div class="body-copy">
                <p>Inspiré par les héritages complicationnels du passé, les expressions chronométriques des orlogeurs disparus et des Grands Esprits, Nicolas Commergnat pratique en Suisse un art horloger sans concession, pur et franc, chargé de contenu et de sens.</p>
              </div>
            </div>
          </section>

          <section
              ref="section3Ref"
              class="v-bio-page__section"
          >
            <div class="v-bio-page__divider"></div>
            <div class="content-row">
              <h2>VISION, IMMERSION,<br>TRANSMISSION.</h2>
              <div class="body-copy">
                <p>Nicolas Commergnat, c’est une aventure entrepreneuriale qui a aussi exploré les voies de l’excellence industrielle, c’est une activité R&amp;D qui continue d’innover avec succès pour des tiers (complications, affichages ludiques, modules additionnels), c’est une tranche de vie vouée également à l’enseignement et à la transmission des connaissances.</p>
              </div>
            </div>

            <div class="content-row">
              <h2>ABSOLUE TRANSPARENCE</h2>
              <div class="body-copy">
                <p>Nicolas Commergnat, c’est une authenticité vraie, résolument fière des talents alentours. Une signature assumée, une marque au caractère entier. Un scénario autoproduit, indépendant et en fonds propres. Un générique de fin ouvert et limpide, un fil de révélations. Une traçabilité exemplaire</p>
              </div>
            </div>
          </section>

          <!-- Un enfant sticky en fin de liste n'a de marge de manœuvre que si un
               frère lui succède dans le même parent : un simple padding sur `.v-bio-page`
               ne suffit pas (comportement de Chrome), il faut un vrai élément. -->
          <div class="v-bio-page__end-spacer" aria-hidden="true"></div>

        </main>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionBio',

  data() {
    return {
      mediaImages: [
        '/img/figma/bio/bio-photo-1.jpg',
        '/img/figma/bio/bio-photo-2.jpg',
        '/img/figma/bio/bio-photo-3.jpg',
      ],
      // Hauteur de chaque photo calquée sur celle du bloc de texte en vis-à-vis,
      // pour que les deux colonnes s'épinglent puis se recouvrent aux mêmes points
      // de scroll (les deux empilements sont pilotés par le même scrollY).
      sectionHeights: [0, 0, 0] as number[],
      // Pas de types DOM pour ResizeObserver dans cette version de TypeScript.
      resizeObserver: null as any,
      // Distance scrollée depuis le haut de la colonne image (mêmes unités que
      // `sectionHeights`), pour savoir laquelle des 3 photos doit être révélée.
      scrolledIntoMedia: 0,
    }
  },

  computed: {
    // Hauteur totale de la colonne (photo fixe + marge de dernière révélation),
    // pour que la fenêtre collante ait le temps de s'épingler jusqu'au bout.
    mediaTotalHeight(): number {
      const total = this.sectionHeights.reduce((sum, h) => sum + h, 0)
      return total ? total + 200 : 0
    },
  },

  mounted() {
    this.measureSectionHeights()
    this.onScroll()

    // Un simple listener resize ne suffit pas : le texte peut encore reflow après le
    // montage (chargement de la webfont), ResizeObserver capte tout changement de taille.
    const RO = (window as any).ResizeObserver
    this.resizeObserver = new RO(() => this.measureSectionHeights())
    for (const el of [this.$refs.section1Ref, this.$refs.section2Ref, this.$refs.section3Ref]) {
      if (el instanceof HTMLElement) this.resizeObserver.observe(el)
    }

    window.addEventListener('scroll', this.onScroll, { passive: true })
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect()
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    measureSectionHeights() {
      this.sectionHeights = [this.$refs.section1Ref, this.$refs.section2Ref, this.$refs.section3Ref]
          .map((el: unknown) => el instanceof HTMLElement ? el.offsetHeight : 0)
    },

    onScroll() {
      const el = this.$refs.mediaRef
      if (!(el instanceof HTMLElement)) return
      this.scrolledIntoMedia = Math.max(0, -el.getBoundingClientRect().top)
    },

    // Position verticale (en % de sa propre hauteur) de la photo `i` : 0% = en
    // place, 100% = complètement cachée sous le bas de son emplacement. La photo
    // ne glisse en place que sur les derniers px du délai de la précédente, pour
    // qu'elle reste invisible tant que ce n'est pas encore son tour.
    revealOffset(i: number): number {
      if (i === 0) return 0

      const TRANSITION = 150
      const revealEnd = this.sectionHeights.slice(0, i).reduce((sum, h) => sum + h, 0)
      const revealStart = Math.max(0, revealEnd - TRANSITION)
      const span = revealEnd - revealStart || 1
      const progress = Math.min(1, Math.max(0, (this.scrolledIntoMedia - revealStart) / span))

      return (1 - progress) * 100
    },
  },
});
</script>

<style lang="scss" scoped>
.v-section-bio {
  margin-top: 15%;
}

/**
 deux colonnes qui s'empilent au scroll en miroir l'une de l'autre
*/

.v-section-bio__sticky {
  @media all and (min-width: 950px) {
    display: flex;
    align-items: flex-start;
  }
}

.v-section-bio__sticky__media {
  box-sizing: border-box;
  width: 100%;
  padding-left: var(--gutter--half);
  padding-right: var(--gutter--half);

  @media (max-width: 949px) {
    height: auto !important;
  }

  @media all and (min-width: 950px) {
    // -20% par rapport aux 40% d'origine
    width: 32%;
    flex-shrink: 0;
    // Même marge gauche que `.v-section-precommande` juste au-dessus, pour que
    // les deux blocs s'alignent visuellement sur le même bord gauche.
    padding-left: 2%;
  }
}

// Fenêtre de taille fixe (calée sur la 1re photo) épinglée à l'écran : toutes les
// photos s'y affichent à la même taille, empilées exactement à la même place.
.v-section-bio__sticky__media__window {
  position: sticky;
  top: var(--gutter);
  box-sizing: border-box;
  overflow: hidden;
  height: auto;

  @media (max-width: 949px) {
    position: static;
    height: auto !important;
    overflow: visible;
  }
}

.v-section-bio__sticky__media__layer {
  position: absolute;
  inset: 0;

  > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 949px) {
    position: static;
    // Le glissement synchronisé n'a de sens qu'avec l'empilement collant du desktop.
    transform: none !important;
    margin-bottom: var(--gutter);

    > img {
      height: auto;
    }
  }
}

.v-section-bio__sticky__content {
  width: 100%;

  @media all and (min-width: 950px) {
    width: 68%;
  }
}

// ─── Page de référence 770 × 1580 ──────────────────────────────────────────

.v-bio-page {
  position: relative;
  box-sizing: border-box;
  width: min(753px, 100%);
  margin: 0 auto;
  padding: var(--gutter--half) 27px;
}

.v-bio-page__end-spacer {
  height: 200px;

  @media (max-width: 650px) {
    height: 64px;
  }
}

// Chaque section s'épingle à la même hauteur que l'image en vis-à-vis, pour qu'au
// scroll la suivante glisse par-dessus et prenne exactement la place de la précédente.
.v-bio-page__section {
  position: sticky;
  top: var(--gutter);
  box-sizing: border-box;
  background-color: var(--color--light);
  padding-bottom: 120px;

  &.v-bio-page__section--tall {
    padding-bottom: 220px;
  }

  @media (max-width: 650px) {
    padding-bottom: 48px;

    &.v-bio-page__section--tall {
      padding-bottom: 64px;
    }
  }
}

.v-bio-page__divider {
  height: 0;
  border-top: 0.25px solid var(--color--black);
  margin-bottom: 48px;

  @media (max-width: 650px) {
    margin-bottom: 24px;
  }
}

.content-row {
  display: grid;
  grid-template-columns: minmax(0, 255px) minmax(0, 381px);
  column-gap: 51px;
  align-items: start;

  & + .content-row {
    margin-top: 64px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    row-gap: 16px;

    & + .content-row {
      margin-top: 40px;
    }
  }
}

.content-row h2 {
  margin: 0;
  font-family: var(--font-family);
  font-size: calc( var(--font-size) * 1.1 );
  line-height: calc( var(--line-height) * 1.2 );
  font-weight: 400;
  letter-spacing: 0.03em;
}

.body-copy p {
  margin: 0 0 1em;
  font-size: var(--font-size);
  line-height: var(--line-height);

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
