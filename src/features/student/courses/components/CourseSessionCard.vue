<template>
  <div
    class="border border-gray-200 rounded-lg p-4 cursor-pointer active:scale-[0.98] transition-transform bg-white"
    @click="handleClick"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-base font-semibold text-gray-900">
          {{ session.experimentName }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
          <i class="pi pi-user text-xs" />
          {{ session.userName }}
        </p>
      </div>
      <i class="pi pi-chevron-right text-gray-400" />
    </div>

    <div class="space-y-2 text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <i class="pi pi-clock text-xs text-gray-400" />
        <span>{{ session.courseTime }}</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="pi pi-map-marker text-xs text-gray-400" />
        <span>{{ session.experimentLocation }}</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="pi pi-users text-xs text-gray-400" />
        <span>{{ displayClassName }}</span>
      </div>
    </div>

    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
      <span class="text-gray-500">
        {{ formatDateTimeRange(session.startTime, session.endTime) }}
      </span>
      <Tag :value="statusLabel" :severity="statusSeverity" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { CourseSessionResponse } from '@/core/api/generated'
import { formatDateTimeRange } from '@/features/student/courses/utils'

interface Props {
  session: CourseSessionResponse
}

const props = defineProps<Props>()
const router = useRouter()

// 显示班级名称（处理合班情况）
const displayClassName = computed(() => {
  if (props.session.isMergedClass) {
    return props.session.classNames?.join('、') || props.session.className
  }
  return props.session.className
})

// 状态标签
const statusLabel = computed(() => {
  const now = new Date()
  const startTime = props.session.startTime ? new Date(props.session.startTime) : null
  const endTime = props.session.endTime ? new Date(props.session.endTime) : null

  if (!startTime || !endTime) return { label: '未知', severity: 'secondary' }

  if (now < startTime) return { label: '未开始', severity: 'info' }
  if (now > endTime) return { label: '已结束', severity: 'secondary' }
  return { label: '进行中', severity: 'success' }
})

const statusSeverity = computed(() => statusLabel.value.severity)

const handleClick = () => {
  if (props.session.courseId && props.session.experimentId) {
    router.push({
      path: `/student/experiments/${props.session.experimentId}`,
      query: { courseId: props.session.courseId }
    })
  }
}
</script>
