<template>
  <Dialog v-model:visible="visible" header="学生批改" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="classExperiment" class="flex h-full gap-4">
      <!-- 左侧：学生列表 -->
      <div class="w-1/3 overflow-y-auto border-r border-slate-200 pr-4">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">学生列表</h3>
        <div v-if="students.isLoading" class="text-center text-slate-500">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="mt-2">{{ LOADING_MESSAGE }}</p>
        </div>
        <div v-else-if="studentsList.length === 0" class="text-center text-slate-500">
          <p>{{ NO_SUBMISSION_MESSAGE }}</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="student in studentsList" :key="student.studentUsername" :class="[
            'cursor-pointer rounded-lg border p-3 transition-colors',
            selectedStudent?.studentUsername === student.studentUsername
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50',
          ]" @click="selectStudent(student)">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900">{{ student.studentName }}</p>
                <p class="text-sm text-slate-600">{{ student.studentUsername }}</p>
              </div>
              <Badge :value="student.submissionCount" :severity="student.submissionCount > 0 ? 'info' : 'secondary'" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：步骤提交列表 -->
      <div class="w-2/3 overflow-y-auto pl-4">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">步骤提交</h3>
        <div v-if="!selectedStudent" class="text-center text-slate-500">
          <p>{{ NO_STUDENT_SELECTED_MESSAGE }}</p>
        </div>
        <div v-else-if="students.isLoading" class="text-center text-slate-500">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="mt-2">{{ LOADING_STUDENT_MESSAGE }}</p>
        </div>
        <div v-else-if="selectedStudentSubmissions.length === 0" class="text-center text-slate-500">
          <p>{{ NO_STUDENT_SUBMISSION_MESSAGE }}</p>
        </div>
        <div v-else class="space-y-4">
          <Card v-for="submission in selectedStudentSubmissions" :key="submission.id"
            class="cursor-pointer transition-shadow hover:shadow-md" @click="viewSubmissionDetail(submission)">
            <template #title>
              <div class="flex items-center justify-between">
                <span>{{ submission.submissionType || DEFAULT_SUBMISSION_TITLE }}</span>
                <Tag :value="getSubmissionStatusText(submission.submissionStatus)"
                  :severity="getSubmissionStatusSeverity(submission.submissionStatus)" />
              </div>
            </template>
            <template #subtitle>
              <div class="text-sm text-slate-600">
                <p>{{ SUBMIT_TIME_LABEL }}: {{ formatDateTime(submission.submissionTime) }}</p>
              </div>
            </template>
            <template #content>
              <div v-if="submission.submissionStatus === SUBMISSION_STATUS.GRADED"
                class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-600">{{ SCORE_DISPLAY }}: {{ submission.score }}</p>
                  <p v-if="submission.teacherComment" class="mt-1 text-sm text-slate-600">
                    {{ COMMENT_DISPLAY }}: {{ submission.teacherComment }}
                  </p>
                </div>
                <Button :label="REGRADE_BUTTON" outlined size="small" @click.stop="openGradeDialog(submission)" />
              </div>
              <div v-else class="flex justify-end">
                <Button :label="GRADE_BUTTON" outlined size="small" @click.stop="openGradeDialog(submission)" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 批改对话框 -->
    <GradeDialog ref="gradeDialogRef" @success="students.refetch" />

    <!-- 步骤详情对话框 -->
    <ProcedureDetailDialog ref="detailDialogRef" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ExperimentInfo } from '@/core/api/generated'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import { useQueryStudentSubmissions, useStudentList } from '../hooks'
import type { StudentSummary } from '../hooks'
import { formatDateTime } from '@/features/shared/utils/formatters'
import { getSubmissionStatusText, getSubmissionStatusSeverity } from '../utils'
import {
  SUBMISSION_STATUS,
  LOADING_MESSAGE,
  NO_SUBMISSION_MESSAGE,
  NO_STUDENT_SELECTED_MESSAGE,
  LOADING_STUDENT_MESSAGE,
  NO_STUDENT_SUBMISSION_MESSAGE,
  DEFAULT_SUBMISSION_TITLE,
  SUBMIT_TIME_LABEL,
  SCORE_DISPLAY,
  COMMENT_DISPLAY,
  REGRADE_BUTTON,
  GRADE_BUTTON,
} from '../constants'
import ProcedureDetailDialog from './ProcedureDetailDialog.vue'
import GradeDialog from './GradeDialog.vue'

// ==================== 对话框状态 ====================
const visible = ref(false)
const classExperiment = ref<ExperimentInfo>()

function open(options: { classExperiment: ExperimentInfo }) {
  classExperiment.value = options.classExperiment
  visible.value = true
}

defineExpose({ open })

// ==================== 数据查询 ====================
const courseId = computed(() => classExperiment.value?.courseId)
const students = useQueryStudentSubmissions(courseId)
const gradeDialogRef = ref<InstanceType<typeof GradeDialog>>()
const detailDialogRef = ref<InstanceType<typeof ProcedureDetailDialog>>()

// ==================== 学生列表（从提交记录中提取） ====================
const studentsList = useStudentList(students.data)

// ==================== 选中的学生 ====================
const selectedStudent = ref<StudentSummary>()

const selectStudent = (student: StudentSummary) => {
  selectedStudent.value = student
}

// ==================== 选中学生的提交记录 ====================
const selectedStudentSubmissions = computed<ProcedureSubmissionResponse[]>(() => {
  if (!selectedStudent.value) return []
  const submissions = students.data.value || []
  return submissions.filter((s) => s.studentUsername === selectedStudent.value?.studentUsername)
})

// ==================== 批改对话框 ====================
const openGradeDialog = (submission: ProcedureSubmissionResponse) => {
  gradeDialogRef.value?.open(submission)
}

// ==================== 查看详情 ====================
const viewSubmissionDetail = (submission: ProcedureSubmissionResponse) => {
  detailDialogRef.value?.open(submission.id!)
}

// ==================== 监听对话框关闭，重置选中状态 ====================
watch(visible, (newVal) => {
  if (!newVal) {
    selectedStudent.value = undefined
  }
})
</script>
