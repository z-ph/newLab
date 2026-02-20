/**
 * 实验步骤工具函数
 */

/**
 * 格式化视频时长
 * @param seconds 视频时长（秒）
 * @returns 格式化后的时长字符串 (mm:ss 或 hh:mm:ss)
 */
export function formatVideoDuration(seconds?: number): string {
  if (!seconds) return ''
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

/**
 * 解析 JSON 字符串
 * @param jsonStr JSON 字符串
 * @returns 解析后的对象，解析失败返回空对象
 */
export function parseJson(jsonStr: string): Record<string, any> {
  try {
    return JSON.parse(jsonStr || '{}')
  } catch {
    return {}
  }
}

/**
 * 解析逗号分隔的字符串为数组
 * @param str 逗号分隔的字符串
 * @returns 解析后的数组，空字符串返回 undefined
 */
export function parseArray(str: string): string[] | undefined {
  if (!str.trim()) return undefined
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * 将数组转换为逗号分隔的字符串
 * @param arr 数组
 * @returns 逗号分隔的字符串
 */
export function stringifyArray(arr?: number[] | string[] | null): string {
  if (!arr || arr.length === 0) return ''
  return arr.map(String).join(',')
}

// 导出时间计算工具类
export { ProcedureTimeCalculator } from './timeCalculator'
export type { ProcedureTimeConfig, ProcedureTimeWindow } from './timeCalculator'

// 导出限时答题密钥生成器
export { TimedQuizKeyGenerator } from './quizKeyGenerator'
export type { QuizKeyComponents } from './quizKeyGenerator'
