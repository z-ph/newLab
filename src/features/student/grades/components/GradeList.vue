<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="grades && grades.length > 0" class="space-y-3">
      <Card
        v-for="grade in grades"
        :key="grade.id"
        class="cursor-pointer active:scale-[0.98] transition-transform"
        @click="handleView(grade)"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Tag
                  :value="grade.grade"
                  :severity="getGradeSeverity(grade.gradeNumeric)"
                />
                <Tag
                  :value="getGradeLevel(grade.gradeNumeric)"
                  :severity="getGradeSeverity(grade.gradeNumeric)"
                  class="text-xs"
                />
              </div>
              <p class="text-sm font-medium text-gray-900">
                {{ grade.courseName }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ grade.semester }}
              </p>
              <div class="flex items-center gap-3 mt-2">
                <span class="text-xs text-gray-500">
                  <i class="pi pi-user mr-1" />
                  {{ grade.teacherName }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDateTime(grade.gradeTime) }}
                </span>
              </div>
            </div>
            <i class="pi pi-chevron-right text-gray-400" />
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-file-excel text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无成绩</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryGrades } from '../hooks'
import {
  formatDateTime,
  getGradeSeverity,
  getGradeLevel,
} from '../utils'
import type { CourseGradeResponse } from '@/core/api/generated'

interface Emits {
  (e: 'view', gradeId: number): void
}

const emit = defineEmits<Emits>()

const { grades, query } = useQueryGrades()

function handleView(grade: CourseGradeResponse) {
  if (!grade.id) return
  emit('view', grade.id)
}
</script>
