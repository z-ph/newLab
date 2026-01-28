/**
 * 课程管理相关类型
 */

import type {
  CourseGradeResponse,
} from '@/core/api/generated'

// TODO: 等待后端添加 CreateCourseRequest, UpdateCourseRequest 后再导入 FormData
// import type { FormData } from '@/features/shared/types'

/**
 * 课程成绩类型 - 从 API 类型派生
 */
export type CourseGrade = CourseGradeResponse

/**
 * 课程表单类型 - 用于创建/编辑
 * TODO: 等待后端添加 CreateCourseRequest, UpdateCourseRequest 类型
 */
export type CourseFormData = Record<string, unknown>

/**
 * 课程查询参数类型
 */
export interface CourseQueryParams {
  courseId?: string
  courseName?: string
  page?: number
  size?: number
}
