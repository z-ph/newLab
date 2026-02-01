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
import AttendanceManagement from './AttendanceManagement.vue'
import type { ExperimentInfo } from '@/core/api/generated'

defineProps<{
  classExperiment: ExperimentInfo | null
}>()

const visible = defineModel<boolean>()
</script>
