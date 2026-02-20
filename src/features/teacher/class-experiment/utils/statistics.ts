/**
 * 统计相关工具函数
 */

import { PROCEDURE_TYPE_TEXT_MAP } from '../constants/config'

/**
 * 获取步骤类型文本
 */
export function getProcedureTypeText(type?: number): string {
  return PROCEDURE_TYPE_TEXT_MAP[type ?? 0] || '未知类型'
}

/**
 * 格式化完成率为百分比
 */
export function formatCompletionRate(rate?: number): string {
  if (rate === undefined || rate === null) return '-'
  return `${(rate * 100).toFixed(1)}%`
}
