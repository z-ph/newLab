/**
 * 学生端步骤时间校验 Hook
 *
 * 用于校验步骤是否在可用时间窗口内
 */

import { computed } from 'vue'
import { ProcedureTimeCalculator } from '@/features/teacher/experiment/procedure/utils'
import type { ProcedureTimeConfig } from '@/features/teacher/experiment/procedure/utils'

/**
 * 步骤时间校验状态
 */
export interface ProcedureTimeValidationStatus {
  /** 步骤是否可用（在时间窗口内） */
  isAvailable: boolean
  /** 是否尚未开始 */
  isNotStarted: boolean
  /** 是否已结束 */
  isEnded: boolean
  /** 剩余时间（分钟） */
  remainingMinutes: number
  /** 距离开始还有多少分钟 */
  minutesUntilStart: number
  /** 开始时间 */
  startTime: Date
  /** 结束时间 */
  endTime: Date
  /** 状态文本 */
  statusText: string
}

/**
 * 步骤时间校验 Hook
 *
 * @param baseTime - 基准时间（班级实验开始时间）
 * @param timeConfig - 步骤时间配置
 * @returns 步骤时间校验状态
 */
export function useProcedureTimeValidation(
  baseTime: Date | string,
  timeConfig: ProcedureTimeConfig
) {
  // 确保 baseTime 是 Date 对象
  const baseDate = computed(() => {
    return typeof baseTime === 'string' ? new Date(baseTime) : baseTime
  })

  // 计算时间窗口
  const timeWindow = computed(() => {
    return ProcedureTimeCalculator.calculateTimeWindow(
      baseDate.value,
      timeConfig,
      new Date()
    )
  })

  // 是否尚未开始
  const isNotStarted = computed(() => {
    return !ProcedureTimeCalculator.isStarted(
      baseDate.value,
      timeConfig.offsetMinutes,
      new Date()
    )
  })

  // 是否已结束
  const isEnded = computed(() => {
    return ProcedureTimeCalculator.isEnded(baseDate.value, timeConfig, new Date())
  })

  // 距离开始还有多少分钟
  const minutesUntilStart = computed(() => {
    return ProcedureTimeCalculator.getMinutesUntilStart(
      baseDate.value,
      timeConfig.offsetMinutes,
      new Date()
    )
  })

  // 状态文本
  const statusText = computed(() => {
    if (timeWindow.value.isAvailable) {
      return `进行中，剩余 ${timeWindow.value.remainingMinutes} 分钟`
    }
    if (isNotStarted.value) {
      return `未开始，${minutesUntilStart.value} 分钟后开始`
    }
    return '已结束'
  })

  // 完整的校验状态
  const validationStatus = computed<ProcedureTimeValidationStatus>(() => ({
    isAvailable: timeWindow.value.isAvailable,
    isNotStarted: isNotStarted.value,
    isEnded: isEnded.value,
    remainingMinutes: timeWindow.value.remainingMinutes,
    minutesUntilStart: minutesUntilStart.value,
    startTime: timeWindow.value.startTime,
    endTime: timeWindow.value.endTime,
    statusText: statusText.value,
  }))

  return {
    validationStatus,
    timeWindow,
    isNotStarted,
    isEnded,
    minutesUntilStart,
    statusText,
  }
}
