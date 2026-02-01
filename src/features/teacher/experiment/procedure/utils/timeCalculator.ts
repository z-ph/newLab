/**
 * 步骤时间计算工具类
 *
 * 用于计算实验步骤的开始时间、结束时间和可用状态
 */

import { TIME_UNITS } from '../constants'

/**
 * 步骤时间配置接口
 */
export interface ProcedureTimeConfig {
  offsetMinutes: number
  durationMinutes: number
}

/**
 * 步骤时间窗口接口
 */
export interface ProcedureTimeWindow {
  startTime: Date
  endTime: Date
  isAvailable: boolean
  remainingMinutes: number
}

/**
 * 步骤时间计算器
 *
 * 功能：
 * - 计算步骤开始时间（基于班级实验开始时间 + 偏移量）
 * - 计算步骤结束时间（开始时间 + 持续时间）
 * - 判断步骤当前是否可用
 * - 计算剩余可用时间
 */
export class ProcedureTimeCalculator {
  /**
   * 计算步骤开始时间
   *
   * @param baseTime - 基准时间（通常是班级实验开始时间）
   * @param offsetMinutes - 偏移量（分钟）
   * @returns 步骤开始时间
   */
  static calculateStartTime(baseTime: Date, offsetMinutes: number): Date {
    const startTime = new Date(baseTime)
    startTime.setTime(startTime.getTime() + offsetMinutes * TIME_UNITS.MINUTE_TO_MS)
    return startTime
  }

  /**
   * 计算步骤结束时间
   *
   * @param startTime - 步骤开始时间
   * @param durationMinutes - 持续时间（分钟）
   * @returns 步骤结束时间
   */
  static calculateEndTime(startTime: Date, durationMinutes: number): Date {
    const endTime = new Date(startTime)
    endTime.setTime(endTime.getTime() + durationMinutes * TIME_UNITS.MINUTE_TO_MS)
    return endTime
  }

  /**
   * 计算步骤时间窗口
   *
   * @param baseTime - 基准时间（班级实验开始时间）
   * @param config - 步骤时间配置
   * @param currentTime - 当前时间（默认为当前系统时间）
   * @returns 步骤时间窗口信息
   */
  static calculateTimeWindow(
    baseTime: Date,
    config: ProcedureTimeConfig,
    currentTime: Date = new Date()
  ): ProcedureTimeWindow {
    const startTime = this.calculateStartTime(baseTime, config.offsetMinutes)
    const endTime = this.calculateEndTime(startTime, config.durationMinutes)

    const isAvailable = currentTime >= startTime && currentTime <= endTime
    const remainingMinutes = isAvailable
      ? Math.max(0, Math.floor((endTime.getTime() - currentTime.getTime()) / TIME_UNITS.MINUTE_TO_MS))
      : 0

    return {
      startTime,
      endTime,
      isAvailable,
      remainingMinutes,
    }
  }

  /**
   * 判断步骤是否已开始
   *
   * @param baseTime - 基准时间
   * @param offsetMinutes - 偏移量（分钟）
   * @param currentTime - 当前时间
   * @returns 是否已开始
   */
  static isStarted(baseTime: Date, offsetMinutes: number, currentTime: Date = new Date()): boolean {
    const startTime = this.calculateStartTime(baseTime, offsetMinutes)
    return currentTime >= startTime
  }

  /**
   * 判断步骤是否已结束
   *
   * @param baseTime - 基准时间
   * @param config - 步骤时间配置
   * @param currentTime - 当前时间
   * @returns 是否已结束
   */
  static isEnded(baseTime: Date, config: ProcedureTimeConfig, currentTime: Date = new Date()): boolean {
    const startTime = this.calculateStartTime(baseTime, config.offsetMinutes)
    const endTime = this.calculateEndTime(startTime, config.durationMinutes)
    return currentTime > endTime
  }

  /**
   * 计算距离开始还有多少分钟
   *
   * @param baseTime - 基准时间
   * @param offsetMinutes - 偏移量（分钟）
   * @param currentTime - 当前时间
   * @returns 距离开始的分钟数（如果已开始则返回 0）
   */
  static getMinutesUntilStart(baseTime: Date, offsetMinutes: number, currentTime: Date = new Date()): number {
    const startTime = this.calculateStartTime(baseTime, offsetMinutes)
    if (currentTime >= startTime) return 0
    return Math.ceil((startTime.getTime() - currentTime.getTime()) / TIME_UNITS.MINUTE_TO_MS)
  }

  /**
   * 计算距离结束还有多少分钟
   *
   * @param baseTime - 基准时间
   * @param config - 步骤时间配置
   * @param currentTime - 当前时间
   * @returns 距离结束的分钟数（如果已结束则返回 0）
   */
  static getMinutesUntilEnd(baseTime: Date, config: ProcedureTimeConfig, currentTime: Date = new Date()): number {
    const startTime = this.calculateStartTime(baseTime, config.offsetMinutes)
    const endTime = this.calculateEndTime(startTime, config.durationMinutes)
    if (currentTime >= endTime) return 0
    return Math.ceil((endTime.getTime() - currentTime.getTime()) / TIME_UNITS.MINUTE_TO_MS)
  }

  /**
   * 格式化时间窗口为人类可读字符串
   *
   * @param timeWindow - 时间窗口
   * @returns 格式化后的字符串，如 "2024-01-01 10:00 - 2024-01-01 11:00"
   */
  static formatTimeWindow(timeWindow: ProcedureTimeWindow): string {
    const format = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }

    return `${format(timeWindow.startTime)} - ${format(timeWindow.endTime)}`
  }

  /**
   * 计算多个步骤的时间窗口
   *
   * @param baseTime - 基准时间
   * @param configs - 步骤时间配置数组
   * @param currentTime - 当前时间
   * @returns 步骤时间窗口数组
   */
  static calculateMultipleTimeWindows(
    baseTime: Date,
    configs: ProcedureTimeConfig[],
    currentTime: Date = new Date()
  ): ProcedureTimeWindow[] {
    return configs.map((config) => this.calculateTimeWindow(baseTime, config, currentTime))
  }

  /**
   * 验证时间配置是否有效
   *
   * @param config - 时间配置
   * @returns 是否有效
   */
  static isValidConfig(config: ProcedureTimeConfig): boolean {
    return (
      config.offsetMinutes >= 0 &&
      config.durationMinutes > 0 &&
      Number.isInteger(config.offsetMinutes) &&
      Number.isInteger(config.durationMinutes)
    )
  }
}
