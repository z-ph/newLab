<template>
  <Dialog v-model:visible="visible" :header="GRADE_DIALOG_TITLE" :modal="true" :style="{ maxWidth: '100vw' }">
    <div v-if="currentSubmission" class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          {{ SUBMISSION_TYPE_LABEL }}
        </label>
        <InputText :model-value="currentSubmission.submissionType || UNKNOWN_TYPE" disabled fluid />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          {{ SCORE_LABEL }} <span class="text-red-500">*</span>
        </label>
        <InputNumber v-model="gradeForm.score" :min="0" :max="100" fluid />
      </div>
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
          {{ COMMENT_LABEL }}
        </label>
        <Textarea v-model="gradeForm.teacherComment" rows="4" fluid />
      </div>
    </div>
    <template #footer>
      <Button label="取消" outlined @click="close" />
      <Button label="保存" :loading="gradeMutation.isPending.value" @click="handleGrade" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import { useGradeSubmission } from '../hooks'
import type { GradeForm } from '../types'
import {
  GRADE_DIALOG_TITLE,
  SUBMISSION_TYPE_LABEL,
  SCORE_LABEL,
  COMMENT_LABEL,
  UNKNOWN_TYPE,
} from '../constants'

// ==================== 对话框状态 ====================
const visible = ref(false)
const currentSubmission = ref<ProcedureSubmissionResponse>()

const gradeForm = reactive<GradeForm>({
  score: null,
  teacherComment: null,
})

const gradeMutation = useGradeSubmission()

// ==================== 对话框方法 ====================
function open(submission: ProcedureSubmissionResponse) {
  currentSubmission.value = submission
  gradeForm.score = submission.score ?? null
  gradeForm.teacherComment = submission.teacherComment ?? null
  visible.value = true
}

function close() {
  visible.value = false
}

function emitSuccess() {
  // 将在父组件中通过 ref 调用时设置
}

defineExpose({ open, close, emitSuccess })

// ==================== 批改逻辑 ====================
const handleGrade = async () => {
  if (!currentSubmission.value || gradeForm.score === null) {
    return
  }

  await gradeMutation.mutateAsync({
    submissionId: currentSubmission.value.id!,
    score: gradeForm.score,
    teacherComment: gradeForm.teacherComment ?? undefined,
  })

  visible.value = false
}
</script>
