<template>
  <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" header="统计信息" :style="{ width: '80vw' }" :modal="true">
    <div class="p-4 text-center text-slate-600">
      <p>统计信息功能</p>
      <p class="text-sm mt-2">实验: {{ classExperiment?.experimentName }}</p>
      <p class="text-sm text-slate-500 mt-4">此功能正在开发中...</p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { ExperimentInfo } from '@/core/api/generated'

defineProps<{
  classExperiment: ExperimentInfo | null
  visible?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()
</script>
