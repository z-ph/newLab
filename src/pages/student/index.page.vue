<template>
  <MobileLayout title="我的课程">
    <div class="space-y-4">
      <!-- 课程会话列表 -->
      <Card>
        <template #content>
          <div v-if="isLoading" class="flex justify-center py-8">
            <ProgressSpinner />
          </div>

          <div v-else-if="courseSessions && courseSessions.length > 0" class="space-y-3">
            <CourseSessionCard
              v-for="session in courseSessions.filter(s => s.classExperimentId)"
              :key="session.classExperimentId"
              :session="session"
            />
          </div>

          <div v-else class="text-center py-12">
            <i class="pi pi-inbox text-4xl text-gray-300 mb-3" />
            <p class="text-sm text-gray-500">暂无课程</p>
          </div>
        </template>
      </Card>
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { useQueryCourseSessions } from '@/features/student/courses/hooks'
import { CourseSessionCard } from '@/features/student/courses';
const { courseSessions, isLoading } = useQueryCourseSessions()
</script>
