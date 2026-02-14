/**
 * 实验步骤相关验证函数
 */

import type { ProcedureStep } from './types'

/**
 * 步骤时间配置接口（通用）
 */
export interface StepTimeConfig {
  offsetMinutes?: number
  durationMinutes?: number
}

/**
 * 步骤时间校验结果
 */
export interface StepTimeValidation {
  isAvailable: boolean
  isNotStarted: boolean
  isEnded: boolean
  remainingMinutes: number
  minutesUntilStart: number
  startTime: Date
  endTime: Date
  statusText: string
}

/**
 * 获取步骤时间校验状态
 *
 * @param step - 实验步骤（支持 ProcedureStep 或其他包含 offsetMinutes/durationMinutes 的对象）
 * @param baseTime - 基准时间（班级实验开始时间）
 * @returns 步骤时间校验结果，如果没有时间配置则返回 null
 */
export function stepTimeValidation(
  step: ProcedureStep | StepTimeConfig,
  baseTime?: Date | string
): StepTimeValidation | null {
  if (step.offsetMinutes === undefined || step.durationMinutes === undefined) {
    return null
  }

  const base = baseTime ? new Date(baseTime) : new Date()
  const now = new Date()
  const startTime = new Date(base.getTime() + step.offsetMinutes * 60000)
  const endTime = new Date(startTime.getTime() + step.durationMinutes * 60000)

  const isNotStarted = now < startTime
  const isEnded = now > endTime
  const isAvailable = !isNotStarted && !isEnded

  const remainingMinutes = isAvailable
    ? Math.floor((endTime.getTime() - now.getTime()) / 60000)
    : 0

  const minutesUntilStart = isNotStarted
    ? Math.ceil((startTime.getTime() - now.getTime()) / 60000)
    : 0

  return {
    isAvailable,
    isNotStarted,
    isEnded,
    remainingMinutes,
    minutesUntilStart,
    startTime,
    endTime,
    statusText: isAvailable
      ? `进行中，剩余 ${remainingMinutes} 分钟`
      : isNotStarted
        ? `${minutesUntilStart} 分钟后开始`
        : '已结束',
  }
}
