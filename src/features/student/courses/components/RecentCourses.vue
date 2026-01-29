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
        <p class="text-sm font-medium text-gray-900">{{ getCourseName(course.submissions) }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ getTeacherName(course.submissions) }}</p>
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
import { getCourseName } from '../utils'

const router = useRouter()
const { courses, query } = useQueryCourses()

/**
 * 获取教师名称
 */
function getTeacherName(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未知教师'
  return submissions[0].teacherName || '教师'
}
</script>
