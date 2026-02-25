<template>
  <div class="space-y-4">
    <!-- 已完成状态 - 显示已提交数据 -->
    <SubmittedStatus
      v-if="isCompleted && stepInfo"
      :type="dataCollectionType"
      :submission-time="stepInfo.submissionTime"
      :score="stepInfo.score"
      :teacher-comment="stepInfo.teacherComment"
      :data-collection-detail="stepInfo.dataCollectionDetail"
    />

    <!-- 不可访问状态 -->
    <template v-else-if="!isAccessible">
      <Card>
        <template #content>
          <div class="text-center py-8">
            <i class="pi pi-lock text-4xl text-orange-400 mb-3" />
            <h3 class="text-base font-medium text-gray-900 mb-2">暂不可提交数据</h3>
            <p class="text-sm text-gray-500">{{ inaccessibleReason || '请先完成前置步骤' }}</p>
          </div>
        </template>
      </Card>
    </template>

    <!-- 可访问且未完成状态 - 显示表单 -->
    <template v-else>
      <DataCollectionForm
        :step-id="stepId"
        :class-code="classCode"
        :step-info="stepInfoForForm"
        :is-loading="isLoadingDetail"
        @submitted="handleSubmitted"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DATA_COLLECTION_TYPE } from '@/features/teacher/experiment/procedure/constants'
import { useQueryProcedureDetail, useQueryStudentExperimentDetail } from '../hooks'
import DataCollectionForm from './components/DataCollectionForm.vue'
import SubmittedStatus from './components/SubmittedStatus.vue'

interface Props {
  stepId: number
  courseId: string
  experimentId: number
  classCode: string
}

const props = defineProps<Props>()

// 获取步骤详情（从实验详情的步骤列表中查找）
const { procedureDetail: stepInfo, isLoadingDetail } = useQueryProcedureDetail(
  computed(() => props.stepId),
  {
    courseId: computed(() => props.courseId),
    experimentId: computed(() => props.experimentId),
    classCode: computed(() => props.classCode),
  }
)

// 获取实验详情（用于刷新数据）
const { query: experimentQuery } = useQueryStudentExperimentDetail(
  computed(() => props.experimentId),
  computed(() => props.classCode)
)

// 是否已完成
const isCompleted = computed(() => stepInfo.value?.isCompleted ?? false)

// 是否可访问
const isAccessible = computed(() => stepInfo.value?.isAccessible ?? true)

// 不可访问原因
const inaccessibleReason = computed(() => stepInfo.value?.inaccessibleReason)

// 数据采集类型
const dataCollectionType = computed(() => {
  return stepInfo.value?.dataCollectionDetail?.type ?? DATA_COLLECTION_TYPE.KEY_DATA
})

// 用于表单的步骤信息
const stepInfoForForm = computed(() => {
  if (!stepInfo.value) return null
  return {
    remark: stepInfo.value.remark,
    dataCollectionDetail: stepInfo.value.dataCollectionDetail,
    submissionTime: stepInfo.value.submissionTime,
  }
})

// 处理提交成功
function handleSubmitted() {
  // 刷新数据
  experimentQuery.refetch()
}
</script>
