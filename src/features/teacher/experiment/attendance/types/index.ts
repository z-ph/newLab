/**
 * 签到管理相关类型
 */

import type {
  AttendanceRecord,
  AttendanceResponse,
  StudentAttendanceInfo,
} from '@/core/api/generated'

/**
 * 签到记录类型
 */
export type AttendanceRecordEntity = AttendanceRecord

/**
 * 签到信息类型
 */
export type AttendanceInfo = AttendanceResponse

/**
 * 学生签到信息类型
 */
export type StudentAttendanceInfoEntity = StudentAttendanceInfo

/**
 * 签到状态类型
 */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
