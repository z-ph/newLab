/**
 * 提交状态常量
 */

/**
 * 提交状态枚举
 */
export const SUBMISSION_STATUS = {
  DRAFT: 0,
  SUBMITTED: 1,
  GRADED: 2,
} as const

/**
 * 提交状态文本映射
 */
export const SUBMISSION_STATUS_TEXT_MAP: Record<number, string> = {
  [SUBMISSION_STATUS.DRAFT]: '草稿',
  [SUBMISSION_STATUS.SUBMITTED]: '已提交',
  [SUBMISSION_STATUS.GRADED]: '已批改',
} as const

/**
 * 提交状态严重程度映射
 */
export const SUBMISSION_STATUS_SEVERITY_MAP: Record<
  number,
  'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
> = {
  [SUBMISSION_STATUS.DRAFT]: 'secondary',
  [SUBMISSION_STATUS.SUBMITTED]: 'info',
  [SUBMISSION_STATUS.GRADED]: 'success',
} as const
