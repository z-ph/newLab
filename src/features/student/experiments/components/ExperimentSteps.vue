<template>
  <div class="space-y-3">
    <!-- 实验步骤列表 -->
    <Card
      v-for="(step, index) in procedureSteps"
      :key="step.id"
      :class="{ 'cursor-pointer': isStepClickable(step) }"
      @click="handleStepClick(step)"
    >
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              :class="getStepClass(step)"
            >
              {{ index + 1 }}
            </div>
            <span class="text-sm">{{ getStepName(step, index) }}</span>
            <i v-if="isStepClickable(step)" class="pi pi-chevron-right text-xs text-gray-400 ml-auto" />
          </div>
          <!-- 时间状态：仅在进行中且剩余时间大于0时显示 -->
          <Tag
            v-if="shouldShowTimeTag(step)"
            :value="getTimeValidation(step)?.statusText"
            :severity="getStepTimeSeverity(step)"
            class="text-xs"
          />
        </div>
      </template>

      <template #content>
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i :class="getStepIcon(step.type)" class="text-gray-500" />
              <span class="text-xs text-gray-600">{{ getStepTypeName(step.type) }}</span>
            </div>
            <Tag
              :value="getStepStatusText(step)"
              :severity="getStepStatusSeverity(step)"
              class="text-xs"
            />
          </div>
          <!-- 不可访问原因 -->
          <p v-if="getStepStatus(step) === STEP_STATUS.INACCESSIBLE" class="text-xs text-red-500 mt-2">
            <i class="pi pi-lock mr-1" />
            {{ getInaccessibleReason(step) }}
          </p>
          <!-- 步骤描述 -->
          <p v-else-if="step.remark" class="text-xs text-gray-500 mt-2 line-clamp-2">{{ step.remark }}</p>
        </div>
      </template>
    </Card>

    <!-- 空状态 -->
    <div v-if="procedureSteps.length === 0" class="text-center py-12">
      <i class="pi pi-list text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无实验步骤</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { stepTimeValidation, getStepStatusText, getStepStatusSeverity, getInaccessibleReason } from '@/features/student/experiments/utils'
import { useQueryStudentExperimentDetail } from '../hooks'
import type { StudentProcedureDetailResponse } from '@/core/api/generated'
import { WARNING_THRESHOLD_MINUTES, STEP_STATUS } from '@/features/student/experiments/constants'
import { getStepStatus } from '@/features/student/experiments/utils/stepStatus'

interface Props {
  courseId: string
  experimentId: string
  classCode: string
  // 基准时间（班级实验开始时间）
  baseTime?: Date | string
}

const props = defineProps<Props>()
const router = useRouter()

// 获取实验详情（包含步骤列表）
const { experimentDetail } = useQueryStudentExperimentDetail(
  computed(() => Number(props.experimentId)),
  computed(() => props.classCode)
)

// 实验步骤列表
const procedureSteps = computed(() => experimentDetail.value?.procedures || [])

/**
 * 获取步骤时间校验结果
 */
function getTimeValidation(step: StudentProcedureDetailResponse) {
  return stepTimeValidation(step, props.baseTime)
}

/**
 * 判断是否应该显示时间标签
 * 仅在：进行中状态 且 有时间配置 且 剩余时间大于0 时显示
 */
function shouldShowTimeTag(step: StudentProcedureDetailResponse): boolean {
  // 非进行中状态不显示
  if (getStepStatus(step) !== STEP_STATUS.IN_PROGRESS) return false
  // 没有时间配置不显示
  const validation = getTimeValidation(step)
  if (!validation) return false
  // 剩余时间为0或未定义不显示
  if (!validation.remainingMinutes || validation.remainingMinutes <= 0) return false
  return true
}

/**
 * 判断步骤是否可点击
 * - 已完成的步骤可以点击查看提交情况
 * - 未完成的步骤需要可访问
 */
function isStepClickable(step: StudentProcedureDetailResponse): boolean {
  // 已完成的步骤可以点击查看提交情况
  if (step.isCompleted) return true
  // 未完成的步骤需要可访问
  return step.isAccessible ?? true
}

/**
 * 处理步骤点击，跳转到步骤详情页
 */
function handleStepClick(step: StudentProcedureDetailResponse) {
  if (!isStepClickable(step) || !step.id) return

  router.push({
    name: '/student/experiment-steps/[stepId]',
    params: {
      stepId: String(step.id),
    },
    query: {
      experimentId: props.experimentId,
      courseId: props.courseId,
      classCode: props.classCode,
      stepType: String(step.type),
    },
  })
}

/**
 * 获取步骤名称
 */
function getStepName(step: StudentProcedureDetailResponse, index: number): string {
  return step.remark || `步骤 ${index + 1}`
}

/**
 * 获取步骤样式类
 */
function getStepClass(step: StudentProcedureDetailResponse): string {
  const status = getStepStatus(step)
  if (status === STEP_STATUS.COMPLETED) return 'bg-green-100 text-green-600'
  if (status === STEP_STATUS.IN_PROGRESS) return 'bg-blue-100 text-blue-600'
  return 'bg-gray-200 text-gray-400'
}

/**
 * 获取步骤时间状态严重性
 */
function getStepTimeSeverity(step: StudentProcedureDetailResponse): 'success' | 'info' | 'warning' | 'danger' {
  const validation = getTimeValidation(step)
  if (!validation) return 'info'
  if (validation.isEnded) return 'danger'
  if (validation.isNotStarted) return 'info'
  if (validation.remainingMinutes < WARNING_THRESHOLD_MINUTES) return 'warning'
  return 'success'
}

/**
 * 获取步骤类型图标
 */
function getStepIcon(type: number | undefined): string {
  if (type === undefined) return 'pi pi-file'
  const iconMap: Record<number, string> = {
    1: 'pi pi-video',       // 视频
    2: 'pi pi-database',    // 数据采集
    3: 'pi pi-question',    // 题目
    5: 'pi pi-clock',       // 限时答题
  }
  return iconMap[type] || 'pi pi-file'
}

/**
 * 获取步骤类型名称
 */
function getStepTypeName(type: number | undefined): string {
  if (type === undefined) return '其他'
  const typeMap: Record<number, string> = {
    1: '观看视频',
    2: '数据采集',
    3: '完成题目',
    5: '限时答题',
  }
  return typeMap[type] || '其他'
}
</script>
