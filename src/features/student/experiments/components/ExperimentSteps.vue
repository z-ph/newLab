<template>
  <div class="space-y-3">
    <!-- 实验步骤列表 -->
    <Card
      v-for="(step, index) in procedureSteps"
      :key="step.id"
      :class="{ 'opacity-50': !isStepUnlocked(step, index) }"
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
        <div v-if="!isStepAvailable(step)" class="py-8 text-center">
          <i class="pi pi-clock text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-600 mb-2">{{ getTimeUnavailableMessage(step) }}</p>
          <p class="text-xs text-gray-400">
            {{ getTimeWindowText(step) }}
          </p>
        </div>

        <!-- 步骤在时间窗口内 -->
        <div v-else>
          <!-- 视频步骤 -->
          <div v-if="step.type === 1">
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700">{{ step.remark || '观看实验视频' }}</p>
              </div>
              <Button
                label="标记已观看"
                outlined
                class="w-full"
                :disabled="!step.videoId"
                :loading="markVideoViewed.isPending.value"
                @click="handleMarkVideoViewed(step)"
              />
            </div>
          </div>

          <!-- 数据采集步骤 -->
          <div v-else-if="step.type === 2">
            <div class="space-y-3">
              <div class="text-sm text-gray-600">
                {{ step.remark || '请按照实验要求完成数据采集' }}
              </div>
              <Button
                label="上传数据"
                outlined
                class="w-full"
                :disabled="!step.dataCollectionId"
                @click="handleUploadData(step)"
              />
            </div>
          </div>

          <!-- 题目步骤 -->
          <div v-else-if="step.type === 3">
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700">{{ step.remark || '完成实验题目' }}</p>
              </div>
              <Button
                label="完成题目"
                class="w-full"
                :disabled="!step.procedureTopicId"
                :loading="completeTopic.isPending.value"
                @click="handleCompleteTopic(step)"
              />
            </div>
          </div>

          <!-- 限时答题步骤 -->
          <div v-else-if="step.type === 5">
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700">{{ step.remark || '限时答题' }}</p>
              </div>
              <Button
                label="开始答题"
                class="w-full"
                :disabled="!step.timedQuizId || step.isLocked"
                @click="handleStartTimedQuiz(step)"
              />
            </div>
          </div>

          <!-- 其他类型 -->
          <div v-else>
            <p class="text-sm text-gray-500">其他类型的步骤 (类型: {{ step.type }})</p>
          </div>

          <!-- 步骤状态 -->
          <div class="mt-3 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">完成状态</span>
              <Tag
                :value="getStepStatusText(step)"
                :severity="getStepStatusSeverity(step)"
                class="text-xs"
              />
            </div>
          </div>
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
import { toast } from '@/core/utils/toast'
import { getTimeUnavailableMessage, getTimeWindowText, stepTimeValidation } from '@/features/student/experiments/utils'
import { useQueryStudentExperimentDetail, useMarkVideoViewed, useCompleteTopic } from '../hooks'
import type { StudentProcedureDetailResponse } from '@/core/api/generated'

interface Props {
  courseId: string
  experimentId: string
  classCode: string
  // 基准时间（班级实验开始时间）
  baseTime?: Date | string
}

const props = defineProps<Props>()

// 获取实验详情（包含步骤列表）
const { experimentDetail, query } = useQueryStudentExperimentDetail(
  computed(() => Number(props.experimentId)),
  computed(() => props.classCode)
)

// 实验步骤列表
const procedureSteps = computed(() => experimentDetail.value?.procedures || [])

// 步骤操作 hooks
const markVideoViewed = useMarkVideoViewed()
const completeTopic = useCompleteTopic()

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
  if (step.isLocked) return 'bg-red-100 text-red-600'
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
  if (validation.remainingMinutes < 10) return 'warning'
  return 'success'
}

function getStepStatusText(step: StudentProcedureDetailResponse): string {
  if (step.isLocked) return '已锁定'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return '进行中'
  return '未解锁'
}

function getStepStatusSeverity(step: StudentProcedureDetailResponse): 'success' | 'info' | 'warning' | 'danger' {
  if (step.isLocked) return 'danger'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return 'warning'
  return 'info'
}

async function handleMarkVideoViewed(step: StudentProcedureDetailResponse) {
  if (!step.videoId || !step.id) {
    toast.warn('视频信息不完整')
    return
  }

  try {
    await markVideoViewed.mutateAsync({
      procedureId: step.id,
      classCode: props.classCode as NonNullable<typeof props.classCode>,
    })
    query.refetch()
  } catch (error) {
    console.error('标记视频观看失败:', error)
  }
}

async function handleCompleteTopic(step: StudentProcedureDetailResponse) {
  if (!step.procedureTopicId) {
    toast.warn('题目信息不完整')
    return
  }

  try {
    await completeTopic.mutateAsync({
      procedureTopicId: step.procedureTopicId,
    })
    query.refetch()
  } catch (error) {
    console.error('完成题目失败:', error)
  }
}

function handleUploadData(step: StudentProcedureDetailResponse) {
  console.log('上传数据', step)
  toast.info('数据上传功能开发中...')
}

function handleStartTimedQuiz(step: StudentProcedureDetailResponse) {
  console.log('开始限时答题', step)
  toast.info('限时答题功能开发中...')
}
</script>
