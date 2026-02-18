<template>
  <MobileLayout :title="courseName">
    <CourseExperimentList
      :course-id="courseId"
      @select="handleSelectExperiment"
    />
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { CourseExperimentList } from '@/features/student/courses'

const route = useRoute()
const router = useRouter()
const params = route.params as { courseId: string }
const courseId = params.courseId || ''

const courseName = courseId || '课程详情'

const handleSelectExperiment = (experimentId: number) => {
  // 跳转到实验详情页（通过查询参数传递 courseId）
  router.push({
    path: `/student/experiments/${experimentId}`,
    query: { courseId }
  })
}
</script>
