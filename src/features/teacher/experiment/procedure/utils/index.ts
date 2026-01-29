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
 * 格式化日期时间
 * @param dateStr 日期时间字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
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
