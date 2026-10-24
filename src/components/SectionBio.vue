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
            :style="cardStyle"
        >
          <div
              v-for="(img, i) in mediaImages"
              :key="img"
              class="v-section-bio__sticky__media__layer"
              :style="{ transform: `translateY(${revealOffsets[i] || 0}px)` }"
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
              :style="cardStyle"
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
              class="v-bio-page__section"
              :style="cardStyle"
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
              :style="cardStyle"
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
      // Hauteur unique partagée par la fenêtre photo ET chacun des 3 blocs de
      // texte : les deux colonnes s'épinglent puis se recouvrent donc toujours aux
      // mêmes points de scroll, quel que soit le texte de chaque bloc.
      cardHeight: 0,
      // Pas de types DOM pour ResizeObserver dans cette version de TypeScript.
      resizeObserver: null as any,
      // Décalage vertical (px) de chaque photo dans la fenêtre : 0 = en place,
      // hauteur de la fenêtre = entièrement cachée sous son bord bas.
      revealOffsets: [0, 0, 0] as number[],
    }
  },

  computed: {
    // Hauteur totale de la colonne (photo fixe + marge de dernière révélation),
    // pour que la fenêtre collante ait le temps de s'épingler jusqu'au bout.
    mediaTotalHeight(): number {
      return this.cardHeight ? this.cardHeight * this.mediaImages.length + 200 : 0
    },

    cardStyle(): Record<string, string> {
      return this.cardHeight ? { height: `${this.cardHeight}px` } : {}
    },
  },

  mounted() {
    this.measureCardHeight()
    this.onScroll()

    // Un simple listener resize ne suffit pas : le texte peut encore reflow après le
    // montage (chargement de la webfont), ResizeObserver capte tout changement de taille.
    const RO = (window as any).ResizeObserver
    // On observe le contenu des blocs (pas les blocs eux-mêmes, dont on impose la
    // hauteur) et la colonne photo (sa largeur fixe la hauteur de la photo).
    this.resizeObserver = new RO(() => {
      this.measureCardHeight()
      this.onScroll()
    })
    const media = this.$refs.mediaRef
    if (media instanceof HTMLElement) this.resizeObserver.observe(media)
    for (const el of this.sectionEls()) {
      Array.from(el.children).forEach((child) => this.resizeObserver.observe(child))
    }

    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect()
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    // La largeur de colonne est suivie par le ResizeObserver, mais pas la hauteur
    // de l'écran, qui plafonne aussi la hauteur des cartes.
    onResize() {
      this.measureCardHeight()
      this.onScroll()
    },

    sectionEls(): HTMLElement[] {
      return [this.$refs.section1Ref, this.$refs.section2Ref, this.$refs.section3Ref]
          .filter((el: unknown): el is HTMLElement => el instanceof HTMLElement)
    },

    // Hauteur = la photo entière à son ratio (2:3) dans la largeur de la colonne,
    // plafonnée à l'écran (moins la marge d'épinglage en haut et en bas) pour que
    // le bas de la photo — là où chaque glissement commence — reste visible.
    // Si un texte venait à dépasser, tout grandit pour lui laisser la place, avec
    // une marge minimale avant le bloc suivant.
    measureCardHeight() {
      const PHOTO_RATIO = 1250 / 833
      const MIN_GAP = 48

      const media = this.$refs.mediaRef
      const win = media instanceof HTMLElement
          ? media.querySelector('.v-section-bio__sticky__media__window')
          : null
      if (!(win instanceof HTMLElement)) return

      // `top: var(--gutter)` des éléments sticky, lu tel que rendu.
      const pinTop = parseFloat(getComputedStyle(win).top) || 0
      const photoHeight = Math.min(win.clientWidth * PHOTO_RATIO, window.innerHeight - 2 * pinTop)

      // Hauteur naturelle du contenu (séparateur + lignes), indépendante de la
      // hauteur imposée au bloc : bas du dernier enfant dans le bloc (sticky, donc
      // c'est bien son offsetParent).
      const tallestText = Math.max(0, ...this.sectionEls().map((el) => {
        const last = el.lastElementChild as HTMLElement | null
        return last ? last.offsetTop + last.offsetHeight : 0
      }))

      this.cardHeight = Math.ceil(Math.max(photoHeight, tallestText + MIN_GAP))
    },

    // Le bord haut de la photo `i` suit exactement le séparateur (haut) du bloc
    // de texte `i` : la photo commence à monter pile quand ce séparateur passe le
    // bas de la fenêtre image, à la même vitesse que le scroll, et finit en place
    // quand le bloc s'épingle en haut. Les deux colonnes bougent donc d'un seul
    // tenant, sans accélération.
    onScroll() {
      const win = (this.$refs.mediaRef as HTMLElement | undefined)
          ?.querySelector('.v-section-bio__sticky__media__window')
      if (!(win instanceof HTMLElement)) return

      const winRect = win.getBoundingClientRect()
      this.revealOffsets = this.sectionEls().map((el, i) => {
        if (i === 0) return 0
        const dividerTop = el.getBoundingClientRect().top
        return Math.min(winRect.height, Math.max(0, dividerTop - winRect.top))
      })
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

// Chaque section a exactement la hauteur de la photo en vis-à-vis et s'épingle au
// même niveau, pour qu'au scroll la suivante glisse par-dessus et prenne exactement
// la place de la précédente.
.v-bio-page__section {
  position: sticky;
  top: var(--gutter);
  box-sizing: border-box;
  background-color: var(--color--light);
  // Hauteur imposée en JS (`cardHeight`), identique à celle de la photo.
  overflow: hidden;
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
