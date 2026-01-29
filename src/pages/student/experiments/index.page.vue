<template>
  <MobileLayout title="实验学习">
    <ExperimentList @select="handleSelectExperiment" />
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import ExperimentList from '@/features/student/experiments/components/ExperimentList.vue'

const router = useRouter()

const handleSelectExperiment = (experimentId: number) => {
  router.push(`/student/experiments/${experimentId}`)
}
</script>
