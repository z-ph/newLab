<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">绑定实验</h1>
        </div>
        <BindExperimentForm />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import BindExperimentForm from '@/features/teacher/class-experiment/components/BindExperimentForm.vue'
</script>
