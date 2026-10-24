<template>
  <div class="v-section-hero">
    <img
        class="v-section-hero__watch"
        src="/img/figma/hero/test__heroshot_montagev1.jpg"
        alt=""
    >
    <time
        class="v-section-hero__clock v-section-hero__clock--date"
        :datetime="isoDate"
    >{{ date }}</time>
    <time
        class="v-section-hero__clock v-section-hero__clock--time"
        :datetime="time"
    >{{ time }}</time>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const pad = (n: number): string => String(n).padStart(2, '0')

export default defineComponent({
  name: 'SectionHero',

  data() {
    return {
      now: new Date(),
      timer: 0,
    }
  },

  computed: {
    date(): string {
      return `${pad(this.now.getDate())}.${pad(this.now.getMonth() + 1)}.${this.now.getFullYear()}`
    },

    isoDate(): string {
      return `${this.now.getFullYear()}-${pad(this.now.getMonth() + 1)}-${pad(this.now.getDate())}`
    },

    time(): string {
      return `${pad(this.now.getHours())}:${pad(this.now.getMinutes())}:${pad(this.now.getSeconds())}`
    },
  },

  mounted() {
    // Recalé sur le début de chaque seconde, pour que l'affichage change en même
    // temps que l'horloge du système (et la date passe d'elle-même à minuit).
    const tick = () => {
      this.now = new Date()
      this.timer = window.setTimeout(tick, 1000 - this.now.getMilliseconds())
    }
    tick()
  },

  beforeUnmount() {
    window.clearTimeout(this.timer)
  },
});
</script>
