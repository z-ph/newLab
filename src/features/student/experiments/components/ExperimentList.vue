<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="submissions && submissions.length > 0" class="space-y-3">
      <Card
        v-for="submission in submissions"
        :key="submission.id"
        class="cursor-pointer active:scale-[0.98] transition-transform"
        @click="handleSelect(submission)"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Tag
                  :value="submission.submissionType"
                  :severity="getSubmissionTypeSeverity(submission.submissionType || '')"
                />
                <span v-if="submission.courseId" class="text-xs text-gray-400">
                  {{ submission.courseId }}
                </span>
              </div>
              <p v-if="submission.fileName" class="text-sm text-gray-900">
                {{ submission.fileName }}
              </p>
              <div class="flex items-center gap-3 mt-2">
                <span v-if="submission.fileSize" class="text-xs text-gray-500">
                  {{ formatFileSize(submission.fileSize) }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDateTime(submission.submissionTime) }}
                </span>
              </div>
            </div>
            <i class="pi pi-chevron-right text-gray-400" />
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-folder-open text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无实验</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryProcedureSubmissions } from '../hooks'
import { formatDateTime, formatFileSize, getSubmissionTypeSeverity } from '../utils'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'

interface Emits {
  (e: 'select', submissionId: number): void
}

const emit = defineEmits<Emits>()

const { submissions, query } = useQueryProcedureSubmissions()

function handleSelect(submission: ProcedureSubmissionResponse) {
  if (!submission.id) return
  emit('select', submission.id)
}
</script>
