<template>
  <MobileLayout :title="courseName">
    <CourseExperimentList />
  </MobileLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { CourseExperimentList, useQueryCourseExperiments } from '@/features/student/courses'

const route = useRoute()
const params = route.params as { courseId: string }
const courseId = params.courseId || ''

// 调用 hook 获取课程名称
const { courseName } = useQueryCourseExperiments(computed(() => courseId))
</script>
