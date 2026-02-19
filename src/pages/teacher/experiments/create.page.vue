<template>
  <div class="p-1">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建实验</h1>
        </div>
        <ExperimentForm @success="handleSuccess" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import ExperimentForm from '@/features/teacher/experiment/components/ExperimentForm.vue'

const handleSuccess = () => {
  // 成功后跳转到列表页，由表单组件处理
}
</script>
