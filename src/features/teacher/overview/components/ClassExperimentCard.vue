<template>
  <Card :class="[
    'transition-all duration-200',
    'cursor-pointer hover:shadow-md',
  ]" @click="handleClick">
    <template #content>
      <div class="space-y-3">
        <!-- 头部：实验名称 + 状态 -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-slate-800">{{ experiment.experimentName }}</h3>
            <p class="text-sm text-slate-500">{{ experiment.courseName }}</p>
          </div>
        </div>

        <!-- 班级信息 -->
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <i class="pi pi-users text-slate-400" />
          <span>{{ getClassDisplayNames(experiment) }}</span>
        </div>

        <!-- 时间信息 -->
        <div class="flex items-center gap-4 text-sm text-slate-600">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-slate-400" />
            <span>{{ formatDate(experiment.startTime) }}</span>
          </div>
          <div v-if="experiment.courseTime" class="flex items-center gap-2">
            <i class="pi pi-clock text-slate-400" />
            <span>{{ experiment.courseTime }}</span>
          </div>
        </div>

        <!-- 地点信息 -->
        <div v-if="experiment.experimentLocation" class="flex items-center gap-2 text-sm text-slate-600">
          <i class="pi pi-map-marker text-slate-400" />
          <span>{{ experiment.experimentLocation }}</span>
        </div>

        <!-- 教师信息 -->
        <div v-if="experiment.teacherName" class="flex items-center gap-2 text-sm text-slate-600">
          <i class="pi pi-user text-slate-400" />
          <span>{{ experiment.teacherName }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import type { ClassExperimentDetailResponse } from '@/core/api/generated'
import { navigateToClassExperimentDetail } from '@/features/teacher/class-experiment'

interface Props {
  experiment: ClassExperimentDetailResponse
}

const props = defineProps<Props>()
const router = useRouter()

function handleClick() {
  navigateToClassExperimentDetail(router, props.experiment)
}

/**
 * 格式化日期显示
 */
function formatDate(dateTime: string | undefined): string {
  if (!dateTime) return ''
  const result = dateTime.split('T')[0]
  return result || ''
}


/**
 * 获取班级显示名称
 */
function getClassDisplayNames(exp: ClassExperimentDetailResponse): string {
  if (exp.isMergedClass && exp.classNames && exp.classNames.length > 0) {
    return exp.classNames.join(' + ')
  }
  return exp.className ?? '未知班级'
}
</script>
