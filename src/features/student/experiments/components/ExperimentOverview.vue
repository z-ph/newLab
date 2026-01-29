<template>
  <div class="space-y-3">
    <!-- 实验信息卡片 -->
    <Card>
      <template #title>实验信息</template>
      <template #content>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">实验ID</span>
            <span class="text-sm font-medium">{{ experimentId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">课程ID</span>
            <span class="text-sm font-medium">{{ courseId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500">进度</span>
            <Tag :value="progressText" :severity="progressSeverity" />
          </div>
        </div>
      </template>
    </Card>

    <!-- 操作卡片 -->
    <Card>
      <template #title>快捷操作</template>
      <template #content>
        <div class="grid grid-cols-2 gap-3">
          <Button
            label="签到"
            icon="pi pi-qrcode"
            outlined
            class="w-full"
            @click="$emit('checkIn')"
          />
          <Button
            label="开始实验"
            icon="pi pi-play"
            class="w-full"
            @click="$emit('start')"
          />
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
              :value="getStatusText(submission.submissionStatus)"
              :severity="getStatusSeverity(submission.submissionStatus)"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQueryProcedureSubmissions } from '../hooks'
import { formatDateTime } from '../utils'

interface Props {
  courseId: string
  experimentId: string
}

interface Emits {
  (e: 'checkIn'): void
  (e: 'start'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const { submissions } = useQueryProcedureSubmissions()

const recentSubmissions = computed(() => {
  if (!submissions.value) return []
  return submissions.value.filter(
    (s) => s.courseId === props.courseId && s.experimentId === props.experimentId
  )
})

const progressText = computed(() => {
  const total = recentSubmissions.value.length
  if (total === 0) return '未开始'
  const completed = recentSubmissions.value.filter((s) => s.submissionStatus === 2).length
  return `${completed}/${total}`
})

const progressSeverity = computed(() => {
  const total = recentSubmissions.value.length
  if (total === 0) return 'info'
  const completed = recentSubmissions.value.filter((s) => s.submissionStatus === 2).length
  if (completed === 0) return 'info'
  if (completed < total) return 'warning'
  return 'success'
})

function getStatusText(status?: number): string {
  const statusMap: Record<number, string> = {
    0: '草稿',
    1: '已提交',
    2: '已批改',
  }
  return statusMap[status ?? 0] || '未知'
}

function getStatusSeverity(status?: number): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<number, 'success' | 'info' | 'warning' | 'danger'> = {
    0: 'info',
    1: 'warning',
    2: 'success',
  }
  return severityMap[status ?? 0] || 'info'
}
</script>
