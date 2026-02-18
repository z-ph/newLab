/**
 * 实验相关工具函���
 */

import type { ClassExperiment } from '@/core/api/generated'

/**
 * 获取实验名称
 * @param classExperiments 班级实验数组
 * @returns 实验名称
 */
export function getExperimentNameFromClasses(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) return '未知实验'
  const first = classExperiments[0]!
  return first.experimentId?.toString() || '未知实验'
}

/**
 * 获取实验时间范围
 * @param classExperiments 班级实验数组
 * @returns 格式化的时间范围字符串
 */
export function getExperimentTimeRange(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) {
    return '暂无时间安排'
  }

  const first = classExperiments[0]!
  if (!first.startTime || !first.endTime) {
    return '暂无时间安排'
  }

  const startDate = new Date(first.startTime)
  const endDate = new Date(first.endTime)

  const format = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  }

  return `${format(startDate)} ~ ${format(endDate)}`
}

/**
 * 获取实验地点
 * @param classExperiments 班级实验数组
 * @returns 实验地点
 */
export function getExperimentLocation(classExperiments: ClassExperiment[]): string {
  if (!classExperiments || classExperiments.length === 0) {
    return '暂无地点'
  }

  const first = classExperiments[0]!
  return first.experimentLocation || '暂无地点'
}
