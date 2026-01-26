/**
 * Mock API 类型定义
 * 基于 OpenAPI 规范的通用类型
 */

// 通用 API 响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 登录相关类型
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
  wxCode?: string
}

export interface LoginResponse {
  userId: number
  username: string
  name: string
  role: string
  token: string
  isFirstLogin: boolean
  wxNickname?: string
  wxAvatar?: string
}

// 二维码相关类型
export interface TeacherQrVO {
  seconds: number
  fileKey: string
}

// 签到相关类型
export interface AttendanceResponse {
  success: boolean
  attendanceStatus: number
  attendanceTime: string
  classCode: string
  experimentId: string
  courseId: string
  message: string
}

export interface AttendanceRecord {
  id: number
  studentId: number
  studentName: string
  studentUsername: string
  classCode: string
  experimentId: string
  courseId: string
  attendanceStatus: number
  attendanceTime: string
  createdAt: string
}

export interface AttendanceStats {
  totalAttendances: number
  presentCount: number
  lateCount: number
  absentCount: number
  attendanceRate: number
}

// 班级相关类型
export interface ClassInfo {
  id: number
  classCode: string
  className: string
  courseId: number
  courseName: string
  teacherId: number
  teacherName: string
  studentCount: number
  createdAt: string
}

export interface StudentInfo {
  id: number
  username: string
  name: string
  role: string
  className?: string
}

// 成绩相关类型
export interface Grade {
  id: number
  studentId: number
  studentName: number
  courseId: number
  experimentId: number
  score: number
  status: string
  comment?: string
  createdAt: string
}

// 实验报告类型
export interface ProcedureSubmission {
  id: number
  studentId: number
  studentName: string
  courseId: number
  experimentId: number
  experimentTitle: string
  fileKey: string
  fileName: string
  submitTime?: string
  status: string
  score?: number
  comment?: string
}

// 微信绑定类型
export interface WeChatBindResponse {
  userId: number
  username: string
  name: string
  wxBound: boolean
  wxNickname?: string
  wxAvatar?: string
  wxBindTime?: string
}

// 用户状态类型
export interface UserStatusDto {
  exists: boolean
  passwordSet: boolean
  role: string
  name: string
}

// 分页响应类型
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
