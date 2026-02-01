<template>
  <Dialog v-model:visible="visible" header="签到管理" :modal="true" :style="{ maxWidth: '100vw' }">
    <AttendanceManagement
      v-if="classExperiment"
      :experiment-id="Number(classExperiment.experimentId)"
      :course-id="classExperiment.courseId || ''"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AttendanceManagement from './AttendanceManagement.vue'
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
