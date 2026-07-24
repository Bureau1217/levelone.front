<template>
  <div class="v-section-intro">
    <subsection
        style="text-align: left"
        styleOption="regular"
        title="Level One"
        :arrowNav="false"
    >
      <slot></slot>
    </subsection>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Subsection from '@/components/Subsection.vue';

export default defineComponent({
  name: 'SectionIntro',
  components: { Subsection },
});
</script>
