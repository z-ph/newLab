/**
 * 实验相关格式化函数
 */

import type { ProcedureStep } from './types'
import { stepTimeValidation } from './validators'

/**
 * 获取提交类型对应的标签颜色
 * @param type - 提交类型
 * @returns PrimeVue Tag severity
 */
export function getSubmissionTypeSeverity(
  type: string
): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> =
    {
      实验报告: 'info',
      数据文件: 'success',
      其他: 'warning',
    }
  return severityMap[type] || 'info'
}

/**
 * 获取时间窗口文本
 *
 * @param step - 实验步骤
 * @param baseTime - 基准时间（班级实验开始时间）
 * @returns 时间窗口文本，格式如 "14:30 - 16:00"
 */
export function getTimeWindowText(
  step: ProcedureStep,
  baseTime?: Date | string
): string {
  const validation = stepTimeValidation(step, baseTime)
  if (!validation) return ''

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return `${formatTime(validation.startTime)} - ${formatTime(validation.endTime)}`
}

