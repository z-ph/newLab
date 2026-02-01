/**
 * 提交相关工具函数
 */

import { SUBMISSION_STATUS_TEXT_MAP, SUBMISSION_STATUS_SEVERITY_MAP } from '../constants/submission'

/**
 * 获取提交状态文本
 */
export function getSubmissionStatusText(status?: number): string {
  return SUBMISSION_STATUS_TEXT_MAP[status ?? 0] || '未知'
}

/**
 * 获取提交状态严重程度
 */
export function getSubmissionStatusSeverity(
  status?: number
): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
  return SUBMISSION_STATUS_SEVERITY_MAP[status ?? 0] || 'secondary'
}
