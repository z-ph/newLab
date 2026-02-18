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
        @click="handleSelect(experiment.experimentId!)"
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
                    {{ getExperimentNameFromClasses(experiment.classExperiments) }}
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
import { getExperimentNameFromClasses, getExperimentTimeRange, getExperimentLocation } from '../utils'

interface Props {
  courseId: string
}

interface Emits {
  (e: 'select', experimentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { experiments, query } = useQueryCourseExperiments(computed(() => props.courseId))

function handleSelect(experimentId: string) {
  emit('select', experimentId)
}
</script>
