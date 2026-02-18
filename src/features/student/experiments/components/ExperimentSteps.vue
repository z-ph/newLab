<template>
  <div class="space-y-3">
    <!-- 实验步骤列表 -->
    <Card
      v-for="(step, index) in procedureSteps"
      :key="step.id"
      :class="{ 'opacity-50': !isStepUnlocked(step, index), 'cursor-pointer': isStepClickable(step) }"
      @click="handleStepClick(step)"
    >
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              :class="getStepClass(step, index)"
            >
              {{ index + 1 }}
            </div>
            <span class="text-sm">{{ getStepName(step, index) }}</span>
            <i v-if="isStepClickable(step)" class="pi pi-chevron-right text-xs text-gray-400 ml-auto" />
          </div>
          <!-- 时间状态 -->
          <Tag
            v-if="getTimeValidation(step)"
            :value="getTimeValidation(step)?.statusText"
            :severity="getStepTimeSeverity(step)"
            class="text-xs"
          />
        </div>
      </template>

      <template #content>
        <!-- 步骤未在时间窗口内 -->
        <div v-if="!isStepAvailable(step)" class="py-4">
          <p class="text-xs text-gray-500">
            <i class="pi pi-clock mr-1" />
            {{ getTimeWindowText(step) }}
          </p>
        </div>

        <!-- 步骤在时间窗口内 -->
        <div v-else class="py-4">
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
          <p v-if="step.remark" class="text-xs text-gray-500 mt-2 line-clamp-2">{{ step.remark }}</p>
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
import { getTimeWindowText, stepTimeValidation } from '@/features/student/experiments/utils'
import { useQueryStudentExperimentDetail } from '../hooks'
import type { StudentProcedureDetailResponse } from '@/core/api/generated'
import { WARNING_THRESHOLD_MINUTES } from '@/features/student/experiments/constants'

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
 * 判断步骤是否在可用时间窗口内
 */
function isStepAvailable(step: StudentProcedureDetailResponse): boolean {
  const validation = getTimeValidation(step)
  if (!validation) return true
  return validation.isAvailable
}

/**
 * 判断步骤是否解锁（前序步骤完成）
 */
function isStepUnlocked(_step: StudentProcedureDetailResponse, index: number): boolean {
  if (index === 0) return true
  const prevStep = procedureSteps.value[index - 1]
  return !!prevStep
}

/**
 * 判断步骤是否可点击（在时间窗口内且未锁定）
 */
function isStepClickable(step: StudentProcedureDetailResponse): boolean {
  return isStepAvailable(step) && !step.isLocked
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
function getStepClass(step: StudentProcedureDetailResponse, index: number): string {
  if (!isStepUnlocked(step, index)) return 'bg-gray-200 text-gray-400'
  if (!isStepAvailable(step)) return 'bg-yellow-100 text-yellow-600'
  if (step.isLocked) return 'bg-green-100 text-green-600'
  return 'bg-blue-100 text-blue-600'
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

function getStepStatusText(step: StudentProcedureDetailResponse): string {
  if (step.isLocked) return '已完成'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return '进行中'
  return '未解锁'
}

function getStepStatusSeverity(step: StudentProcedureDetailResponse): 'success' | 'info' | 'warning' | 'danger' {
  if (step.isLocked) return 'success'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return 'warning'
  return 'info'
}
</script>
