/**
 * 考勤相关格式化函数
 */

/**
 * 获取签到状态文本
 * @param status - 签到状态码
 * @returns 签到状态文本
 */
export function getAttendanceStatusText(status?: number): string {
  const statusMap: Record<number, string> = {
    0: '正常',
    1: '迟到',
    2: '补签',
    3: '跨班签到',
  }
  return statusMap[status ?? 0] || '未知'
}

/**
 * 获取签到状态标签颜色
 * @param status - 签到状态码
 * @returns PrimeVue Tag severity
 */
export function getAttendanceStatusSeverity(
  status?: number
): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<number, 'success' | 'info' | 'warning' | 'danger'> = {
    0: 'success',
    1: 'warning',
    2: 'info',
    3: 'danger',
  }
  return severityMap[status ?? 0] || 'info'
}
