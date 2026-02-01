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
        @click="$emit('select', experiment.experimentId)"
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
                    {{ getExperimentName(experiment.submissions) }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ experiment.experimentId }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center gap-1">
                  <i class="pi pi-tasks text-gray-400 text-sm" />
                  <span class="text-xs text-gray-500">
                    {{ experiment.submissions.length }} 个步骤
                  </span>
                </div>

                <Tag
                  :value="getStatusText(experiment.submissions)"
                  :severity="getStatusSeverity(experiment.submissions)"
                  class="text-xs"
                />
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
import { computed } from 'vue';
import { useQueryCourseExperiments } from '../hooks'
import { getExperimentName } from '../utils'

interface Props {
  courseId: string
}

interface Emits {
  (e: 'select', experimentId: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const { experiments, query } = useQueryCourseExperiments(computed(()=>props.courseId))

function getStatusText(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未开始'

  // 检查是否有已提交的
  const hasSubmitted = submissions.some((s) => s.submissionStatus === 2)
  if (hasSubmitted) return '进行中'

  return '未开始'
}

function getStatusSeverity(submissions: any[]): 'success' | 'info' | 'warning' | 'danger' {
  if (!submissions || submissions.length === 0) return 'info'

  const hasSubmitted = submissions.some((s) => s.submissionStatus === 2)
  if (hasSubmitted) return 'warning'

  return 'info'
}
</script>

