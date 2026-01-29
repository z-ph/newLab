/**
 * 格式化视频时长
 * @param seconds 秒数
 * @returns 格式化后的时长字符串（如 "1:23:45" 或 "23:45"）
 */
export function formatDuration(seconds?: number): string {
  if (!seconds) return '-'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串（如 "12.34 MB"）
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return '-'
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

/**
 * 格式化日期时间
 * @param dateTime 日期时间字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}
