/**
 * 课程管理路由跳转工具
 */

import type { Router } from 'vue-router'
import type { CourseResponse } from '@/core/api/generated'

/**
 * 跳转到课程详情页面
 */
export function navigateToCourseDetail(
  router: Router,
  course: CourseResponse,
) {
  if (!course.courseId) return

  router.push({
    path: `/teacher/courses/${course.courseId}/detail`,
    query: {
      tabbarName: course.courseName || '课程详情',
      courseName: course.courseName || '',
      courseId: course.id?.toString(),
    },
  })
}

/**
 * 跳转到创建课程页面
 */
export function navigateToCourseCreate(router: Router) {
  router.push('/teacher/courses/create')
}
