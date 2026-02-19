<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建实验</h1>
        </div>
        <ExperimentFormDialog :visible="true" @success="handleSuccess" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import { ExperimentFormDialog } from '@/features/teacher/experiment'

const router = useRouter()

const handleSuccess = () => {
  router.push('/teacher/experiments/list')
}
</script>
