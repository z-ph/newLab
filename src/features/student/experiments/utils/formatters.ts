/**
 * 格式化日期时间
 * @param dateStr - 日期字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return '-'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

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
