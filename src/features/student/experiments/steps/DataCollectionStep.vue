<template>
  <div class="space-y-4">
    <!-- 步骤信息 -->
    <Card>
      <template #content>
        <div class="space-y-2">
          <h3 class="text-base font-medium text-gray-900">{{ stepInfo?.remark || '数据采集' }}</h3>
          <p class="text-sm text-gray-600">请按照实验要求完成数据采集</p>
        </div>
      </template>
    </Card>

    <!-- 数据采集表单 -->
    <Card>
      <template #content>
        <div class="text-center py-8">
          <i class="pi pi-database text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-500 mb-4">数据采集功能开发中...</p>
          <Button label="上传数据" outlined disabled />
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
