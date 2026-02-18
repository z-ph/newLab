import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import {
  SUBMISSION_STATUS_TEXT,
  SUBMISSION_STATUS_SEVERITY,
  SUBMISSION_STATUS,
} from '../constants/status'

/**
 * 获取提交状态文��
 * @param status - 提交状态（从 API 派生）
 * @returns 状态文本
 */
export function getSubmissionStatusText(
  status?: ProcedureSubmissionResponse['submissionStatus']
): string {
  if (status === undefined || status === null) {
    return SUBMISSION_STATUS_TEXT[SUBMISSION_STATUS.DRAFT]
  }
  return SUBMISSION_STATUS_TEXT[status as keyof typeof SUBMISSION_STATUS_TEXT] || '未知'
}

/**
 * 获取提交状态严重程度
 * @param status - 提交状态（从 API 派生）
 * @returns 状态严重程度
 */
export function getSubmissionStatusSeverity(
  status?: ProcedureSubmissionResponse['submissionStatus']
): 'success' | 'info' | 'warning' | 'danger' {
  if (status === undefined || status === null) {
    return SUBMISSION_STATUS_SEVERITY[SUBMISSION_STATUS.DRAFT]
  }
  return (
    SUBMISSION_STATUS_SEVERITY[status as keyof typeof SUBMISSION_STATUS_SEVERITY] || 'info'
  )
}

/**
 * 判断提交是否已批改
 * @param status - 提交状态
 */
export function isSubmissionGraded(
  status: ProcedureSubmissionResponse['submissionStatus']
): boolean {
  return status === SUBMISSION_STATUS.GRADED
}

/**
 * 计算完成进度
 * @param submissions - 提交列表
 * @returns 已完成数 / 总数
 */
export function calculateProgress(
  submissions: ProcedureSubmissionResponse[]
): { completed: number; total: number } {
  const total = submissions.length
  const completed = submissions.filter((s) => isSubmissionGraded(s.submissionStatus)).length
  return { completed, total }
}
