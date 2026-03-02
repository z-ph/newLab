<template>
  <div class="p-1 space-y-4">
    <Card>
      <template #content>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-slate-900">创建实验</h1>
        </div>
        <ExperimentForm @success="handleSuccess" />
      </template>
    </Card>

    <ExperimentTable :query="query">
      <template #header>
        <h2 class="text-lg font-semibold text-slate-800">已有实验模版</h2>
      </template>
    </ExperimentTable>
  </div>
</template>

<script setup lang="ts">
import ExperimentForm from '@/features/teacher/experiment/components/ExperimentForm.vue'
import { ExperimentTable, useQueryExperimentPage } from '@/features/teacher/experiment'



// 查询实验列表
const query = useQueryExperimentPage({
  current: 1,
  size: 5,
})



const handleSuccess = () => {
  query.refetch()
}
</script>
