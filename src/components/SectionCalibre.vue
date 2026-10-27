<template>
  <section class="v-section-calibre">
    <div class="v-section-calibre__inner">

      <h2 class="v-section-calibre__title">Spécifications</h2>

      <!-- One row per spec: text left, image right -->
      <div
          v-for="(spec, i) in specs"
          :key="i"
          class="v-section-calibre__row"
      >
        <div class="v-section-calibre__text">
          <h3 v-if="spec.title" class="v-section-calibre__subtitle">{{ spec.title }}</h3>
          <hr class="v-section-calibre__divider">
          <p class="v-section-calibre__body">{{ spec.body }}</p>
          <hr class="v-section-calibre__divider">
        </div>

        <div class="v-section-calibre__media">
          <img :src="spec.image" alt="" class="v-section-calibre__img">
        </div>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionCalibre',

  data() {
    return {
      specs: [
        {
          title: 'Calibre Mécanique',
          body: "Mouvement Manufacture FM01 — première utilisation en horlogerie entièrement fabriqué et usiné à l'interne. Le développement de ce mouvement a une logique pour une solution durable, des assortiments de transmissions et d'échappement NIHS, universalité de l'assemblage, réparabilité sans limite de temps.",
          image: '/img/figma/specifications/ezgif-5-2d87e8e550.gif',
        },
        {
          title: '',
          body: "28'800 alternances / heure (4 Hertz)",
          image: '/img/figma/specifications/ezgif-3-7cbd7f864c.gif',
        },
        {
          title: '',
          body: "Décorations Côtes de Genève, soit selon les 7 côtes hommages au 7 plumes de l'aigle du drapeau genevois. Micro-perlage platine sus et sous.",
          image: '/img/figma/specifications/ezgif-1-8b6469ca95.gif',
        },
      ],
    }
  },
});
</script>
