<template>
  <section class="v-section-precommande">
    <div class="v-section-precommande__block">

      <div class="v-section-precommande__content">
        <div class="v-section-precommande__top">
          <h1 class="v-section-precommande__title">Précommande</h1>
          <p class="v-section-precommande__body">
            Vous désirez acquérir une montre<br>
            Nicolas Commergnat&nbsp;?
          </p>
        </div>
        <a href="#" class="v-section-precommande__cta">
          <span class="v-section-precommande__cta-label">Faire une demande</span>
          <img
              src="/img/figma/precommande/precommande-arrow.svg"
              alt=""
              class="v-section-precommande__cta-arrow"
          >
        </a>
      </div>

      <div class="v-section-precommande__media">
        <img
            src="/img/figma/precommande/precommande-bg.jpg"
            alt=""
            class="v-section-precommande__img"
        >
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SectionPrecommande',
});
</script>
