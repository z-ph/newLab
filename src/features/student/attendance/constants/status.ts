/**
 * 签到状态常量
 */

/**
 * 签到状态类型
 */
export type AttendanceStatus = 0 | 1 | 2 | 3

/**
 * 签到状态值
 */
export const ATTENDANCE_STATUS = {
  NORMAL: 0,
  LATE: 1,
  MAKEUP: 2,
  CROSS_CLASS: 3,
} as const satisfies Record<string, AttendanceStatus>

/**
 * 签到状态文本映射
 */
export const ATTENDANCE_STATUS_TEXT: Record<AttendanceStatus, string> = {
  0: '正常',
  1: '迟到',
  2: '补签',
  3: '跨班签到',
}

/**
 * 签到状态严重程度映射
 */
export const ATTENDANCE_STATUS_SEVERITY: Record<
  AttendanceStatus,
  'success' | 'info' | 'warning' | 'danger'
> = {
  0: 'success',
  1: 'warning',
  2: 'info',
  3: 'danger',
}

/**
 * 获取签到状态文本
 */
export function getAttendanceStatusText(status?: number): string {
  if (status === undefined) return '未知'
  return ATTENDANCE_STATUS_TEXT[status as AttendanceStatus] || '未知'
}

/**
 * 获取签到状态严重程度
 */
export function getAttendanceStatusSeverity(
  status?: number
): 'success' | 'info' | 'warning' | 'danger' {
  if (status === undefined) return 'info'
  return ATTENDANCE_STATUS_SEVERITY[status as AttendanceStatus] || 'info'
}
