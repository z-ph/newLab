<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    header="学生批改"
    :modal="true"
  >
    <div v-if="classExperiment" class="flex h-full gap-4">
      <!-- 左侧：学生列表 -->
      <div class="w-1/3 overflow-y-auto border-r border-slate-200 pr-4">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">学生列表</h3>
        <div v-if="students.isLoading" class="text-center text-slate-500">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="mt-2">加载���...</p>
        </div>
        <div v-else-if="studentsList.length === 0" class="text-center text-slate-500">
          <p>暂无学生提交</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="student in studentsList"
            :key="student.username"
            :class="[
              'cursor-pointer rounded-lg border p-3 transition-colors',
              selectedStudent?.username === student.username
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50',
            ]"
            @click="selectStudent(student)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900">{{ student.name }}</p>
                <p class="text-sm text-slate-600">{{ student.username }}</p>
              </div>
              <Badge
                :value="student.submissionCount"
                :severity="student.submissionCount > 0 ? 'info' : 'secondary'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：步骤提交列表 -->
      <div class="w-2/3 overflow-y-auto pl-4">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">步骤提交</h3>
        <div v-if="!selectedStudent" class="text-center text-slate-500">
          <p>请选择学生查看提交记录</p>
        </div>
        <div v-else-if="students.isLoading" class="text-center text-slate-500">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
          <p class="mt-2">加载中...</p>
        </div>
        <div v-else-if="selectedStudentSubmissions.length === 0" class="text-center text-slate-500">
          <p>该学生暂无提交记录</p>
        </div>
        <div v-else class="space-y-4">
          <Card
            v-for="submission in selectedStudentSubmissions"
            :key="submission.id"
            class="cursor-pointer transition-shadow hover:shadow-md"
            @click="viewSubmissionDetail(submission)"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <span>{{ submission.submissionType || '提交记录' }}</span>
                <Tag
                  :value="getSubmissionStatusText(submission.submissionStatus)"
                  :severity="getSubmissionStatusSeverity(submission.submissionStatus)"
                />
              </div>
            </template>
            <template #subtitle>
              <div class="text-sm text-slate-600">
                <p>提交时间: {{ formatDateTime(submission.submissionTime) }}</p>
              </div>
            </template>
            <template #content>
              <div v-if="submission.submissionStatus === 2" class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-600">得分: {{ submission.score }}</p>
                  <p v-if="submission.teacherComment" class="mt-1 text-sm text-slate-600">
                    评语: {{ submission.teacherComment }}
                  </p>
                </div>
                <Button label="重新批改" outlined size="small" @click.stop="openGradeDialog(submission)" />
              </div>
              <div v-else class="flex justify-end">
                <Button label="批改" outlined size="small" @click.stop="openGradeDialog(submission)" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- 批改对话框 -->
    <Dialog v-model:visible="showGradeDialog" header="批改" :modal="true">
      <div v-if="currentSubmission" class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            提交类型
          </label>
          <InputText :model-value="currentSubmission.submissionType || '未知'" disabled fluid />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            得分 <span class="text-red-500">*</span>
          </label>
          <InputNumber v-model="gradeForm.score" :min="0" :max="100" fluid />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            评语
          </label>
          <Textarea v-model="gradeForm.teacherComment" rows="4" fluid />
        </div>
      </div>
      <template #footer>
        <Button label="取消" outlined @click="showGradeDialog = false" />
        <Button label="保存" :loading="gradeMutation.isPending.value" @click="handleGrade" />
      </template>
    </Dialog>

    <!-- 步骤详情对话框 -->
    <ProcedureDetailDialog ref="detailDialogRef" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { ExperimentInfo } from '@/core/api/generated'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import { useQueryStudentSubmissions } from '../hooks'
import { useGradeSubmission } from '../hooks'
import { formatDateTime } from '../utils'
import ProcedureDetailDialog from './ProcedureDetailDialog.vue'

interface Props {
  classExperiment: ExperimentInfo | null
  visible?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// ==================== 数据查询 ====================
const students = useQueryStudentSubmissions(props.classExperiment?.courseId || '', {
  enable: !!props.classExperiment?.courseId && props.visible,
})

const gradeMutation = useGradeSubmission()
const detailDialogRef = ref<InstanceType<typeof ProcedureDetailDialog>>()

// ==================== 学生列表（从提交记录中提取） ====================
interface StudentInfo {
  username: string
  name: string
  submissionCount: number
}

const studentsList = computed<StudentInfo[]>(() => {
  const submissions = students.data.value || []
  const studentMap = new Map<string, StudentInfo>()

  submissions.forEach((submission) => {
    const username = submission.studentUsername || ''
    const name = submission.studentName || username

    if (username) {
      const existing = studentMap.get(username)
      if (existing) {
        existing.submissionCount++
      } else {
        studentMap.set(username, {
          username,
          name,
          submissionCount: 1,
        })
      }
    }
  })

  return Array.from(studentMap.values()).sort((a, b) => a.name.localeCompare(b.name))
})

// ==================== 选中的学生 ====================
const selectedStudent = ref<StudentInfo | null>(null)

const selectStudent = (student: StudentInfo) => {
  selectedStudent.value = student
}

// ==================== 选中学生的提交记录 ====================
const selectedStudentSubmissions = computed<ProcedureSubmissionResponse[]>(() => {
  if (!selectedStudent.value) return []
  const submissions = students.data.value || []
  return submissions.filter((s) => s.studentUsername === selectedStudent.value?.username)
})

// ==================== 批改表单 ====================
const showGradeDialog = ref(false)
const currentSubmission = ref<ProcedureSubmissionResponse | null>(null)

interface GradeForm {
  score: number | null
  teacherComment: string
}

const gradeForm = reactive<GradeForm>({
  score: null,
  teacherComment: '',
})

const openGradeDialog = (submission: ProcedureSubmissionResponse) => {
  currentSubmission.value = submission
  gradeForm.score = submission.score || null
  gradeForm.teacherComment = submission.teacherComment || ''
  showGradeDialog.value = true
}

const handleGrade = async () => {
  if (!currentSubmission.value || gradeForm.score === null) {
    return
  }

  await gradeMutation.mutateAsync({
    submissionId: currentSubmission.value.id!,
    score: gradeForm.score,
    teacherComment: gradeForm.teacherComment,
  })

  showGradeDialog.value = false
  students.refetch()
}


// ==================== 查看详情 ====================
const viewSubmissionDetail = (submission: ProcedureSubmissionResponse) => {
  // 直接使用 submission.id 查询详情
  detailDialogRef.value?.open(submission.id!)
}

// ==================== 工具函数 ====================
const getSubmissionStatusText = (status?: number): string => {
  const statusMap: Record<number, string> = {
    0: '草稿',
    1: '已提交',
    2: '已批改',
  }
  return statusMap[status || 0] || '未知'
}

const getSubmissionStatusSeverity = (status?: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' => {
  const severityMap: Record<number, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
    0: 'secondary',
    1: 'info',
    2: 'success',
  }
  return severityMap[status || 0] || 'secondary'
}

// ==================== 监听对话框关闭，重置选中状态 ====================
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      selectedStudent.value = null
    }
  }
)
</script>
