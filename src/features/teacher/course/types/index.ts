/**
 * 课程管理相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  CourseResponse,
  CourseGradeResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseQueryRequest,
} from '@/core/api/generated'

/**
 * 课程实体类型 - 从 API 类型派生
 */
export type CourseEntity = CourseResponse

/**
 * 课程详情类型 - 包含更多信息
 */
export type CourseDetail = CourseResponse

/**
 * 课程表单类型 - 用于创建/编辑
 */
export type CourseFormData = FormData<CreateCourseRequest>

/**
 * 课程更新表单类型
 */
export type CourseUpdateFormData = FormData<UpdateCourseRequest>

/**
 * 课程查询参数类型 - 从 API 类型派生
 */
export type CourseQueryParams = CourseQueryRequest

/**
 * 课程成绩类型 - 从 API 类型派生
 */
export type CourseGrade = CourseGradeResponse
