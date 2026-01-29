<template>
  <div>
    <div class="space-y-6">
      <!-- 基本信息 -->
      <Card>
        <template #title>实验信息</template>
        <template #content>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">实验ID</label>
              <p class="font-medium">{{ submission?.experimentId || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">课程ID</label>
              <p class="font-medium">{{ submission?.courseId || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">提交类型</label>
              <p class="font-medium">{{ submission?.submissionType || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">提交时间</label>
              <p class="font-medium">{{ formatDateTime(submission?.submissionTime) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 文件信息 -->
      <Card v-if="submission?.fileName">
        <template #title>文件信息</template>
        <template #content>
          <div class="space-y-2">
            <div>
              <label class="text-sm text-gray-500">文件名</label>
              <p class="font-medium">{{ submission.fileName }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">文件大小</label>
              <p class="font-medium">{{ formatFileSize(submission.fileSize) }}</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 操作 -->
      <Card>
        <template #title>操作</template>
        <template #content>
          <div class="text-sm text-gray-500">
            操作功能开发中...
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryProcedureSubmissions } from '../hooks'
import { formatDateTime, formatFileSize } from '@/features/shared/utils'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'

interface Props {
  submissionId: number
}

const props = defineProps<Props>()

const { submissions } = useQueryProcedureSubmissions()

const submission = computed(
  () =>
    submissions.value?.find(
      (s: ProcedureSubmissionResponse) => s.id === props.submissionId
    )
)
</script>
