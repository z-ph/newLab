<template>
  <div class="space-y-4">
    <!-- 未提交状态 - 显示表单 -->
    <DataCollectionForm
      :step-id="stepId"
      :class-code="classCode"
      :step-info="stepInfoForForm"
      @submitted="handleSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryProcedureDetail, useQueryStudentExperimentDetail } from '../hooks'
import DataCollectionForm from './components/DataCollectionForm.vue'

interface Props {
  stepId: number
  courseId: string
  experimentId: number
  classCode: string
}

const props = defineProps<Props>()

// 获取步骤详情（从实验详情的步骤列表中查找）
const { procedureDetail: stepInfo } = useQueryProcedureDetail(
  computed(() => props.stepId),
  {
    experimentId: computed(() => props.experimentId),
    classCode: computed(() => props.classCode),
  }
)

// 获取实验详情（用于刷新数据）
const { query: experimentQuery } = useQueryStudentExperimentDetail(
  computed(() => props.experimentId),
  computed(() => props.classCode)
)

// 用于表单的步骤信息
const stepInfoForForm = computed(() => {
  return {
    remark: stepInfo.value?.remark,
    dataCollectionDetail: undefined, // TODO: 需要调用 API 获取详细的数据采集配置
  }
})

// 处理提交成功
function handleSubmitted() {
  // 刷新数据
  experimentQuery.refetch()
}
</script>
