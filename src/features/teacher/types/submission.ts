/**
 * 提交批改相关类型
 */

import type {
  ProcedureSubmissionResponse,
  GradeProcedureRequest,
  StudentResult,
} from '@/core/api/generated'

/**
 * 步骤提交实体类型
 */
export type SubmissionEntity = ProcedureSubmissionResponse

/**
 * 提交状态类型
 */
export type SubmissionStatus = 'draft' | 'submitted' | 'reviewed' | 'rejected'

/**
 * 评分表单类型
 */
export type GradingFormData = GradeProcedureRequest

/**
 * 学生实体类型 - 从 API 类型派生
 * 注意：这个类型应该从 student feature 中导入，这里暂时保留
 * TODO: 考虑将学生相关类型移到 student feature 或 shared/types
 */
export type StudentEntity = StudentResult

/**
 * 学生状态类型
 * 注意：这个类型应该从 student feature 中导入，这里暂时保留
 * TODO: 考虑将学生相关类型移到 student feature 或 shared/types
 */
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended'
