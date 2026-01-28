/**
 * 成绩管理相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  CourseGradeResponse,
  SaveGradeRequest,
} from '@/core/api/generated'

/**
 * 成绩实体类型
 */
export type GradeEntity = CourseGradeResponse

/**
 * 成绩表单类型
 */
export type GradeFormData = FormData<SaveGradeRequest>
