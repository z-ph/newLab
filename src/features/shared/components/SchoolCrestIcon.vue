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

</script>

<template>
  <img
    src="@/assets/gdut.png"
    :alt="props.alt"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    class="block object-contain"
  />
</template>
