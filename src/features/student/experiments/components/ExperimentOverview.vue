<template>
  <div class="space-y-3">
    <!-- 实验信息卡片 -->
    <Card>
      <template #title>实验信息</template>
      <template #content>
        <div class="space-y-2">
          <div v-if="experimentName" class="flex justify-between">
            <span class="text-sm text-gray-500">实验名称</span>
            <span class="text-sm font-medium">{{ experimentName }}</span>
          </div>
          <div v-if="courseName" class="flex justify-between">
            <span class="text-sm text-gray-500">课程名称</span>
            <span class="text-sm font-medium">{{ courseName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">进度</span>
            <Tag :value="progressText" :severity="progressSeverity" />
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">签到状态</span>
            <div class="flex items-center gap-2">
              <Tag :value="attendanceStatusText" :severity="attendanceSeverity" />
              <span v-if="attendanceTime" class="text-xs text-gray-400">
                {{ formatTime(attendanceTime) }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 最近提交 -->
    <Card v-if="recentSubmissions && recentSubmissions.length > 0">
      <template #title>最近提交</template>
      <template #content>
        <div class="space-y-2">
          <div
            v-for="submission in recentSubmissions.slice(0, 3)"
            :key="submission.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ submission.submissionType }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDateTime(submission.submissionTime) }}
              </p>
            </div>
            <Tag
              :value="getSubmissionStatusText(submission.submissionStatus)"
              :severity="getSubmissionStatusSeverity(submission.submissionStatus)"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import { useQueryProcedureSubmissions } from '../hooks'
import { useQueryCourseExperiments } from '@/features/student/courses/hooks'
import { useQueryAttendanceRecords } from '@/features/student/attendance/hooks'
import { formatDateTime, formatTime } from '@/features/shared/utils/formatters'
import {
  getSubmissionStatusText,
  getSubmissionStatusSeverity,
  calculateProgress,
} from '../utils'
import { getAttendanceStatusText, getAttendanceStatusSeverity } from '@/features/student/attendance/constants'

/**
 * Props 类型 - 从 API 类型派生
 */
interface Props {
  courseId: ProcedureSubmissionResponse['courseId']
  experimentId: ProcedureSubmissionResponse['experimentId']
}

const props = defineProps<Props>()

// 获取提交数据（使用过滤参数）
const { submissions } = useQueryProcedureSubmissions({
  courseId: computed(() => props.courseId),
  experimentId: computed(() => props.experimentId),
})

// 获取课程数据以获取名称
const { experiments: courseExperiments } = useQueryCourseExperiments(
  computed(() => props.courseId || '')
)

// 获取实验名称
const experimentName = computed(() => {
  if (!courseExperiments.value) return undefined
  const experiment = courseExperiments.value.find(
    (exp) => String(exp.experimentId) === props.experimentId
  )
  return experiment?.experimentName
})

// 获取课程名称
const courseName = computed(() => {
  if (!courseExperiments.value || courseExperiments.value.length === 0) return undefined
  // 所有实验的课程名称相同，取第一个
  const firstExperiment = courseExperiments.value[0]
  if (!firstExperiment?.classExperiments || firstExperiment.classExperiments.length === 0) {
    return undefined
  }
  return firstExperiment.classExperiments[0]?.courseName
})

const recentSubmissions = computed(() => {
  if (!submissions.value) return []
  return submissions.value
})

const progressText = computed(() => {
  const { completed, total } = calculateProgress(recentSubmissions.value)
  if (total === 0) return '未开始'
  return `${completed}/${total}`
})

const progressSeverity = computed(() => {
  const { completed, total } = calculateProgress(recentSubmissions.value)
  if (total === 0) return 'info'
  if (completed === 0) return 'info'
  if (completed < total) return 'warning'
  return 'success'
})

// 获取签到数据
const { records } = useQueryAttendanceRecords()

// 筛选当前实验的签到记录
const attendanceHistory = computed(() => {
  if (!records.value) return []
  return records.value.filter(
    (r) => r.courseId === props.courseId && r.experimentId === props.experimentId
  )
})

// 获取今日签到记录
const todayAttendance = computed(() => {
  if (attendanceHistory.value.length === 0) return null
  // 获取最新的签到记录
  return attendanceHistory.value[attendanceHistory.value.length - 1]
})

// 签到状态文本
const attendanceStatusText = computed(() => {
  if (!todayAttendance.value) return '未签到'
  return getAttendanceStatusText(todayAttendance.value.attendanceStatus)
})

// 签到状态严重性
const attendanceSeverity = computed(() => {
  if (!todayAttendance.value) return 'info'
  return getAttendanceStatusSeverity(todayAttendance.value.attendanceStatus)
})

// 签到时间
const attendanceTime = computed(() => {
  return todayAttendance.value?.attendanceTime
})
</script>
