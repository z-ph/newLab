/**
 * 实验相关格式化函数
 */

import { stepTimeValidation, type StepTimeConfig } from './validators'
import { formatTime } from '@/features/shared/utils/formatters'

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
 * @param step - 实验步骤（包含 offsetMinutes/durationMinutes 字段）
 * @param baseTime - 基准时间（班级实验开始时间）
 * @returns 时间窗口文本，格式如 "14:30 - 16:00"
 */
export function getTimeWindowText(
  step: StepTimeConfig,
  baseTime?: Date | string
): string {
  const validation = stepTimeValidation(step, baseTime)
  if (!validation) return ''

  return `${formatTime(validation.startTime)} - ${formatTime(validation.endTime)}`
}
