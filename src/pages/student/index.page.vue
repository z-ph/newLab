<template>
  <MobileLayout title="我的课程">
    <div class="space-y-4">
      <!-- 课程列表 -->
      <Card>
        <template #content>
          <CourseList @select="handleSelectCourse" />
        </template>
      </Card>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { CourseList } from '@/features/student/courses'

const router = useRouter()

const handleSelectCourse = (courseId: string) => {
  router.push(`/student/courses/${courseId}`)
}
</script>
