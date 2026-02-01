/**
 * 批改相关类型定义
 */

import type { ProcedureSubmissionResponse } from '@/core/api/generated'

/**
 * 批改表单类型（基于 API 类型派生，将 undefined 转换为 null 以适配表单组件）
 */
export type GradeForm = {
  [K in keyof Pick<ProcedureSubmissionResponse, 'score' | 'teacherComment'>]: Exclude<
    ProcedureSubmissionResponse[K],
    undefined
  > | null
}
