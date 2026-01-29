<template>
  <MobileLayout title="我的课程">
    <div class="space-y-4">
      <!-- 课程列表 -->
      <Card>
        <template #content>
          <div v-if="query.isLoading.value" class="flex justify-center py-8">
            <ProgressSpinner />
          </div>

          <div v-else-if="courses && courses.length > 0" class="space-y-3">
            <div
              v-for="course in courses"
              :key="course.courseId"
              class="border border-gray-200 rounded-lg p-4 cursor-pointer active:scale-[0.98] transition-transform"
              @click="router.push(`/student/courses/${course.courseId}`)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-base font-semibold text-gray-900">
                    {{ getCourseName(course.submissions) }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ getTeacherName(course.submissions) }}
                  </p>
                </div>
                <i class="pi pi-chevron-right text-gray-400" />
              </div>

              <!-- 课程进度 -->
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">
                  实验进度: {{ getCourseProgress(course.submissions).completed }}/{{
                    getCourseProgress(course.submissions).total
                  }}
                </span>
                <Tag
                  :value="getProgressLabel(course.submissions)"
                  :severity="getProgressSeverity(course.submissions)"
                />
              </div>
            </div>
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
import { useRouter } from 'vue-router'
import MobileLayout from '@/features/student/components/MobileLayout.vue'
import { useQueryCourses } from '@/features/student/courses/hooks'
import { getCourseName, getCourseProgress } from '@/features/student/courses/utils'

const router = useRouter()
const { courses, query } = useQueryCourses()

/**
 * 获取教师名称
 */
function getTeacherName(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未知教师'
  return submissions[0].teacherName || '教师'
}

/**
 * 获取进度标签
 */
function getProgressLabel(submissions: any[]): string {
  const { completed, total } = getCourseProgress(submissions)
  if (total === 0) return '未开始'
  const percentage = (completed / total) * 100
  if (percentage === 100) return '已完成'
  if (percentage >= 50) return '进行中'
  return '刚开始'
}

/**
 * 获取进度标签颜色
 */
function getProgressSeverity(submissions: any[]): 'success' | 'info' | 'warning' | 'danger' {
  const { completed, total } = getCourseProgress(submissions)
  if (total === 0) return 'info'
  const percentage = (completed / total) * 100
  if (percentage === 100) return 'success'
  if (percentage >= 50) return 'info'
  return 'warning'
}
</script>
