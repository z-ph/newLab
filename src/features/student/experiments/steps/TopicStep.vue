<template>
  <div class="space-y-4">
    <!-- 步骤信息 -->
    <Card>
      <template #content>
        <div class="space-y-2">
          <h3 class="text-base font-medium text-gray-900">{{ stepInfo?.remark || '完成题目' }}</h3>
          <p class="text-sm text-gray-600">请按照要求完成实验题目</p>
        </div>
      </template>
    </Card>

    <!-- 题目内容 -->
    <Card>
      <template #content>
        <div class="text-center py-8">
          <i class="pi pi-question text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-500 mb-4">题目答题功能开发中...</p>
          <Button label="开始答题" outlined disabled />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryProcedureDetail } from '../hooks'

interface Props {
  stepId: number
  courseId: string
  experimentId: number
  classCode: string
}

const props = defineProps<Props>()

// 获取步骤详情
const { procedureDetail: stepInfo } = useQueryProcedureDetail(
  computed(() => props.stepId),
  {
    experimentId: computed(() => props.experimentId),
    classCode: computed(() => props.classCode),
  }
)
</script>
