import type { ProcedureSubmissionResponse } from '@/core/api/generated'

/**
 * 提交状态常量
 * 对应 API 注释：draft-草稿，submitted-已提交，graded-已批改
 */
export const SUBMISSION_STATUS = {
  /** 草稿 */
  DRAFT: 0,
  /** 已提交 */
  SUBMITTED: 1,
  /** 已批改 */
  GRADED: 2,
} as const

/**
 * 提交状态类型
 */
export type SubmissionStatus = typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS]

/**
 * 提交状态文本映射
 */
export const SUBMISSION_STATUS_TEXT: Record<SubmissionStatus, string> = {
  [SUBMISSION_STATUS.DRAFT]: '草稿',
  [SUBMISSION_STATUS.SUBMITTED]: '已提交',
  [SUBMISSION_STATUS.GRADED]: '已批改',
}

/**
 * 提交状态严重程度映射
 */
export const SUBMISSION_STATUS_SEVERITY: Record<
  SubmissionStatus,
  'success' | 'info' | 'warning' | 'danger'
> = {
  [SUBMISSION_STATUS.DRAFT]: 'info',
  [SUBMISSION_STATUS.SUBMITTED]: 'warning',
  [SUBMISSION_STATUS.GRADED]: 'success',
}

/**
 * 从 API 类型派生的提交状态
 */
export type SubmissionStatusFromAPI = ProcedureSubmissionResponse['submissionStatus']
