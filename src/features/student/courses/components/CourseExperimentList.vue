<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="experiments && experiments.length > 0" class="space-y-3">
      <Card
        v-for="experiment in experiments"
        :key="experiment.experimentId"
        class="cursor-pointer active:scale-[0.98] transition-transform"
        @click="handleSelect(Number(experiment.experimentId))"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-folder text-green-600" />
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-900">
                    {{ getExperimentName(experiment.classExperiments) }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ experiment.experimentId }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center gap-1">
                  <i class="pi pi-clock text-gray-400 text-sm" />
                  <span class="text-xs text-gray-500">
                    {{ getExperimentTimeRange(experiment.classExperiments) }}
                  </span>
                </div>

                <div class="flex items-center gap-1">
                  <i class="pi pi-map-marker text-gray-400 text-sm" />
                  <span class="text-xs text-gray-500">
                    {{ getExperimentLocation(experiment.classExperiments) }}
                  </span>
                </div>
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
import { computed } from 'vue'
import { useQueryCourseExperiments } from '../hooks'
import type { ClassExperiment } from '@/core/api/generated'

interface Props {
  courseId: string
}

interface Emits {
  (e: 'select', experimentId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { experiments, query } = useQueryCourseExperiments(computed(() => props.courseId))

function handleSelect(experimentId: number) {
  emit('select', experimentId)
}

function getExperimentName(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) return '未知实验'
  const first = classExperiments[0]!
  return (first.experimentId as string | undefined) || '未知实验'
}

function getExperimentTimeRange(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) {
    return '暂无时间安排'
  }

  const first = classExperiments[0]!
  if (!first.startTime || !first.endTime) {
    return '暂无时间安排'
  }

  const startDate = new Date(first.startTime!)
  const endDate = new Date(first.endTime!)

  const format = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  }

  return `${format(startDate)} ~ ${format(endDate)}`
}

function getExperimentLocation(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) {
    return '暂无地点'
  }

  const first = classExperiments[0]!
  return (first.experimentLocation as string | undefined) || '暂无地点'
}
</script>
