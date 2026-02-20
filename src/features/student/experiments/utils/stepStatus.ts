/**
 * 步骤状态计算工具函数
 */

import { STEP_STATUS, STEP_STATUS_TEXT, STEP_STATUS_SEVERITY, type StepStatus } from '../constants/status'
import type { StudentProcedureDetailResponse } from '@/core/api/generated'

/**
 * 计算步骤状态
 * 优先级：已完成 > 进行中 > 不可访问
 */
export function getStepStatus(step: StudentProcedureDetailResponse): StepStatus {
  // 1. 已完成
  if (step.isCompleted) {
    return STEP_STATUS.COMPLETED
  }

  // 2. 不可访问（API 返回 isAccessible=false）
  if (step.isAccessible === false) {
    return STEP_STATUS.INACCESSIBLE
  }

  // 3. 进行中
  return STEP_STATUS.IN_PROGRESS
}

/**
 * 获取步骤状态文本
 */
export function getStepStatusText(step: StudentProcedureDetailResponse): string {
  const status = getStepStatus(step)
  return STEP_STATUS_TEXT[status]
}

/**
 * 获取步骤状态严重程度
 */
export function getStepStatusSeverity(step: StudentProcedureDetailResponse): 'success' | 'info' | 'warning' | 'danger' {
  const status = getStepStatus(step)
  return STEP_STATUS_SEVERITY[status]
}

/**
 * 获取不可访问原因
 * 如果有 inaccessibleReason 则返回，否则返回默认提示
 */
export function getInaccessibleReason(step: StudentProcedureDetailResponse): string {
  if (step.inaccessibleReason) {
    return step.inaccessibleReason
  }
  return '请先完成前置步骤'
}
