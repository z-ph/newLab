<template>
  <Dialog v-model:visible="visible" header="统计信息" :modal="true" :style="{ maxWidth: '100vw' }">
    <div class="p-4 text-center text-slate-600">
      <p>统计信息功能</p>
      <p class="text-sm mt-2">实验: {{ classExperiment?.experimentName }}</p>
      <p class="text-sm text-slate-500 mt-4">此功能正在开发中...</p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ExperimentInfo } from '@/core/api/generated'

const visible = ref(false)
const classExperiment = ref<ExperimentInfo>()

interface OpenOptions {
  classExperiment: ExperimentInfo
}

function open(options: OpenOptions) {
  classExperiment.value = options.classExperiment
  visible.value = true
}

defineExpose({ open })
</script>
