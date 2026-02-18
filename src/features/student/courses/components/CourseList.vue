<template>
  <div>
    <div v-if="query.isLoading.value" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>

    <div v-else-if="courses && courses.length > 0" class="space-y-3">
      <Card
        v-for="course in courses"
        :key="course.courseId"
        class="cursor-pointer active:scale-[0.98] transition-transform"
        @click="$emit('select', course.courseId!)"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-book text-blue-600" />
                </div>
                <div>
                  <h3 class="text-base font-semibold text-gray-900">
                    {{ course.courseName }}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ course.courseId }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <div class="flex items-center gap-1">
                  <i class="pi pi-list text-gray-400 text-sm" />
                  <span class="text-xs text-gray-500">
                    {{ course.classExperiments.length }} 个实验
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
      <i class="pi pi-book text-4xl text-gray-300 mb-3" />
      <p class="text-sm text-gray-500">暂无课程</p>
      <p class="text-xs text-gray-400 mt-1">请先加入班级</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryCourses } from '../hooks'

interface Emits {
  (e: 'select', courseId: string): void
}

defineEmits<Emits>()

const { courses, query } = useQueryCourses()
</script>

