<template>
  <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <template #title>总学生数</template>
      <template #content>
        <p class="text-3xl font-bold text-blue-600">{{ statistics.totalStudents || 0 }}</p>
      </template>
    </Card>
    <Card>
      <template #title>已提交人数</template>
      <template #content>
        <p class="text-3xl font-bold text-green-600">{{ statistics.submittedCount || 0 }}</p>
      </template>
    </Card>
    <Card>
      <template #title>完成率</template>
      <template #content>
        <p class="text-3xl font-bold text-purple-600">
          {{ statistics.completionRate || 0 }}%
        </p>
      </template>
    </Card>
  </div>
  <Card v-else class="text-center py-8">
    <p class="text-slate-500">请先选择班级查看统计信息</p>
  </Card>
</template>

<script setup lang="ts">
import type { ClassExperimentStatisticsResponse } from '@/core/api/generated'

interface Props {
  statistics: ClassExperimentStatisticsResponse | null
  loading: boolean
}

defineProps<Props>()
</script>
