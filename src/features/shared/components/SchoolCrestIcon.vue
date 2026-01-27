<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    size?: number;
    alt?: string;
  }>(),
  {
    size: 40,
    alt: 'School crest',
  }
);

const src = '/signlab/gdut.png';
</script>

<template>
  <img
    :src="src"
    :alt="props.alt"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    class="block object-contain"
  />
</template>
