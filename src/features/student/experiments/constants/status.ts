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

/**
 * 步骤状态常量
 */
export const STEP_STATUS = {
  /** 已完成 */
  COMPLETED: 'completed',
  /** 进行中 */
  IN_PROGRESS: 'in_progress',
  /** 不可访问（统一处理：未开始、已结束、前置未完成等） */
  INACCESSIBLE: 'inaccessible',
} as const

/**
 * 步骤状态类型
 */
export type StepStatus = typeof STEP_STATUS[keyof typeof STEP_STATUS]

/**
 * 步骤状态文本映射
 */
export const STEP_STATUS_TEXT: Record<StepStatus, string> = {
  [STEP_STATUS.COMPLETED]: '已完成',
  [STEP_STATUS.IN_PROGRESS]: '进行中',
  [STEP_STATUS.INACCESSIBLE]: '不可访问',
}

/**
 * 步骤状态严重程度映射
 */
export const STEP_STATUS_SEVERITY: Record<StepStatus, 'success' | 'info' | 'warning' | 'danger'> = {
  [STEP_STATUS.COMPLETED]: 'success',
  [STEP_STATUS.IN_PROGRESS]: 'warning',
  [STEP_STATUS.INACCESSIBLE]: 'danger',
}
