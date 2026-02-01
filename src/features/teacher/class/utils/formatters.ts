/**
 * 格式化日期时间为本地化字符串
 *
 * @param dateStr - ISO 日期字符串
 * @returns 格式化后的日期时间字符串，如 "2024/01/15 14:30"
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'

  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
