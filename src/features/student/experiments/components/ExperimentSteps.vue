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
            <span class="text-sm">{{ step.procedureName || `步骤 ${index + 1}` }}</span>
          </div>
          <!-- 时间状态 -->
          <Tag
            v-if="stepTimeValidation(step, baseTime)"
            :value="stepTimeValidation(step, baseTime)?.statusText"
            :severity="getStepTimeSeverity(step)"
            class="text-xs"
          />
        </div>
      </template>

      <template #content>
        <!-- 步骤未在时间窗口内 -->
        <div v-if="!isStepAvailable(step)" class="py-8 text-center">
          <i class="pi pi-clock text-4xl text-gray-300 mb-3" />
          <p class="text-sm text-gray-600 mb-2">{{ getTimeUnavailableMessage(step, baseTime) }}</p>
          <p class="text-xs text-gray-400">
            {{ getTimeWindowText(step, baseTime) }}
          </p>
        </div>

        <!-- 步骤在时间窗口内 -->
        <div v-else>
          <!-- 视频步骤 -->
          <div v-if="step.stepType === 1">
            <div class="space-y-3">
              <div v-if="step.videoUrl" class="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  :src="step.videoUrl"
                  controls
                  class="w-full h-full"
                  @ended="handleVideoComplete(step.id)"
                />
              </div>
              <Button
                label="标记已观看"
                outlined
                class="w-full"
                :disabled="step.isCompleted"
                @click="handleMarkVideoViewed(step.id)"
              />
            </div>
          </div>

          <!-- 题目步骤 -->
          <div v-else-if="step.stepType === 2">
            <div class="space-y-3">
              <div class="bg-gray-50 p-3 rounded">
                <p class="text-sm text-gray-700">{{ step.topicContent || '题目内容' }}</p>
              </div>
              <Button
                label="完成题目"
                class="w-full"
                :disabled="step.isCompleted"
                @click="handleCompleteTopic(step)"
              />
            </div>
          </div>

          <!-- 数据采集步骤 -->
          <div v-else-if="step.stepType === 3">
            <div class="space-y-3">
              <div class="text-sm text-gray-600">
                {{ step.dataCollectionInstruction || '请按照实验要求完成数据采集' }}
              </div>
              <Button
                label="上传数据"
                outlined
                class="w-full"
                :disabled="step.isCompleted"
                @click="handleUploadData(step)"
              />
            </div>
          </div>

          <!-- 其他类型 -->
          <div v-else>
            <p class="text-sm text-gray-500">其他类型的步骤</p>
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
import { ref } from 'vue'
import { toast } from '@/core/utils/toast'
import { getTimeUnavailableMessage, getTimeWindowText, stepTimeValidation } from '@/features/student/experiments/utils'
import type { ProcedureStep } from '@/features/student/experiments/utils'

interface Props {
  courseId: string
  experimentId: string
  // 基准时间（班级实验开始时间）
  baseTime?: Date | string
}

const props = defineProps<Props>()

// 模拟实验步骤数据（实际应从API获取）
const procedureSteps = ref<ProcedureStep[]>([
  {
    id: 1,
    stepType: 1, // 视频
    procedureName: '观看实验视频',
    videoUrl: '',
    isCompleted: false,
    offsetMinutes: 0,
    durationMinutes: 60,
  },
  {
    id: 2,
    stepType: 2, // 题目
    procedureName: '完成实验题目',
    topicContent: '请回答实验相关问题',
    isCompleted: false,
    offsetMinutes: 60,
    durationMinutes: 90,
  },
  {
    id: 3,
    stepType: 3, // 数据采集
    procedureName: '提交实验数据',
    dataCollectionInstruction: '请拍摄实验现象并记录数据',
    isCompleted: false,
    offsetMinutes: 150,
    durationMinutes: 120,
  },
])

/**
 * 判断步骤是否在可用时间窗口内
 */
function isStepAvailable(step: ProcedureStep): boolean {
  const validation = stepTimeValidation(step, props.baseTime)
  if (!validation) return true // 没有时间配置则默认可用
  return validation.isAvailable
}

/**
 * 判断步骤是否解锁（前序步骤完成）
 */
function isStepUnlocked(_step: ProcedureStep, index: number): boolean {
  if (index === 0) return true
  const prevStep = procedureSteps.value[index - 1]
  return prevStep ? prevStep.isCompleted : false
}

/**
 * 获取步骤样式类
 */
function getStepClass(step: ProcedureStep, index: number): string {
  if (!isStepUnlocked(step, index)) return 'bg-gray-200 text-gray-400'
  if (!isStepAvailable(step)) return 'bg-yellow-100 text-yellow-600'
  if (step.isCompleted) return 'bg-green-100 text-green-600'
  return 'bg-blue-100 text-blue-600'
}

/**
 * 获取步骤时间状态严重性
 */
function getStepTimeSeverity(step: ProcedureStep): 'success' | 'info' | 'warning' | 'danger' {
  const validation = stepTimeValidation(step, props.baseTime)
  if (!validation) return 'info'
  if (validation.isEnded) return 'danger'
  if (validation.isNotStarted) return 'info'
  if (validation.remainingMinutes < 10) return 'warning'
  return 'success'
}

function getStepStatusText(step: ProcedureStep): string {
  if (step.isCompleted) return '已完成'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return '进行中'
  return '未解锁'
}

function getStepStatusSeverity(step: ProcedureStep): 'success' | 'info' | 'warning' | 'danger' {
  if (step.isCompleted) return 'success'
  const index = procedureSteps.value.indexOf(step)
  if (isStepUnlocked(step, index) && isStepAvailable(step)) return 'warning'
  return 'info'
}

function handleVideoComplete(procedureId: number) {
  console.log('视频观看完成', procedureId)
  toast.success('视频观看完成')
}

async function handleMarkVideoViewed(procedureId: number) {
  const step = procedureSteps.value.find((s) => s.id === procedureId)
  if (step) {
    step.isCompleted = true
  }
  toast.success('已标记为已观看')
}

function handleCompleteTopic(step: ProcedureStep) {
  console.log('完成题目', step)
  toast.info('题目功能开发中...')
}

function handleUploadData(step: ProcedureStep) {
  console.log('上传数据', step)
  toast.info('数据上传功能开发中...')
}
</script>
