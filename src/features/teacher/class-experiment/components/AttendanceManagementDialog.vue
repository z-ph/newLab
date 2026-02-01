<template>
  <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" header="签到管理" :modal="true">
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
  visible?: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()
</script>
