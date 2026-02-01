/**
 * 实验步骤相关消息常量
 */

import type { ProcedureStep } from './types'
import { stepTimeValidation } from './validators'

/**
 * 获取时间不可用提示消息
 *
 * @param step - 实验步骤
 * @param baseTime - 基准时间（班级实验开始时间）
 * @returns 时间不可用时的提示消息
 */
export function getTimeUnavailableMessage(
  step: ProcedureStep,
  baseTime?: Date | string
): string {
  const validation = stepTimeValidation(step, baseTime)
  if (!validation) return '步骤不可用'
  if (validation.isNotStarted) return '步骤尚未开始'
  if (validation.isEnded) return '步骤已结束'
  return '步骤不可用'
}
