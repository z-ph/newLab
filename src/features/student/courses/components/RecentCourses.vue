<template>
  <div v-if="query.isLoading.value" class="flex justify-center py-4">
    <ProgressSpinner />
  </div>

  <div v-else-if="courses && courses.length > 0" class="space-y-2">
    <div
      v-for="course in courses.slice(0, 3)"
      :key="course.courseId"
      class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
      @click="router.push(`/student/courses/${course.courseId}`)"
    >
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">{{ course.courseName }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ course.classExperiments.length }} 个实验</p>
      </div>
      <i class="pi pi-chevron-right text-gray-400 text-sm" />
    </div>
  </div>

  <div v-else class="text-center py-8">
    <i class="pi pi-inbox text-3xl text-gray-300 mb-2" />
    <p class="text-xs text-gray-500">暂无课程</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQueryCourses } from '../hooks'

const router = useRouter()
const { courses, query } = useQueryCourses()
</script>
