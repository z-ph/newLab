<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="experiments && experiments.length > 0" class="space-y-3">
      <Card
        v-for="exp in experiments"
        :key="exp.experimentId"
        @click="handleSelect(exp.experimentId!)"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="pi pi-folder text-green-600" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900">
                  {{ exp.experimentName || exp.experimentId }}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ exp.experimentId }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 mt-3">
              <div class="flex items-center gap-1">
                <i class="pi pi-clock text-gray-400 text-sm" />
                <span class="text-xs text-gray-500">
                  {{ getExperimentTimeRange(exp.classExperiments) }}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-map-marker text-gray-400 text-sm" />
                <span class="text-xs text-gray-500">
                  {{ getExperimentLocation(exp.classExperiments) }}
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

interface Props {
  courseId: string
}

interface Emits {
  (e: 'select', experimentId: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const experiments = [
  { id: 1, experimentId: 123, classExperiments: [] as any },
  { id: 2, experimentId: 456, classExperiments: [] as any },
  { id: 3, experimentId: 789, classExperiments: [] as any },
]

const query = {
  isLoading: ref(false),
  data: ref(experiments),
}

function getExperimentName(classExperiments: any[]): string {
  if (!classExperiments || classExperiments.length === 0) return '未知实验'
  const first = classExperiments[0]!
  return (first.experimentId as string) || '未知实验'
}

function getExperimentTimeRange(classExperiments: any[]): string {
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

function getExperimentLocation(classExperiments: any[]): string {
  if (!classExperiments || classExperiments.length === 0) {
    return '暂无地点'
  }
  const first = classExperiments[0]!
  return (first.experimentLocation as string | undefined) || '暂无地点'
}

function handleSelect(experimentId: number) {
  emit('select', experimentId)
}
</script>