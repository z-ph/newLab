/**
 * 签到管理相关常量
 */

/**
 * API 端点
 */
export const ATTENDANCE_API_ENDPOINTS = {
  base: '/api/teacher/attendance',
} as const

/**
 * 签到状态常量
 */
export const ATTENDANCE_STATUS = {
  NORMAL: 1, // 正常签到
  LATE: 2, // 迟到
  EXCUSED: 3, // 请假
  ABSENT: 4, // 未签到
} as const

/**
 * 签到状态选项
 */
export const ATTENDANCE_STATUS_OPTIONS = [
  { label: '正常签到', value: ATTENDANCE_STATUS.NORMAL, severity: 'success' },
  { label: '迟到', value: ATTENDANCE_STATUS.LATE, severity: 'warning' },
  { label: '请假', value: ATTENDANCE_STATUS.EXCUSED, severity: 'info' },
  { label: '未签到', value: ATTENDANCE_STATUS.ABSENT, severity: 'danger' },
]

