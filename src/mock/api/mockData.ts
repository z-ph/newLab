/**
 * Mock API 数据
 */

import type {
  LoginResponse,
  TeacherQrVO,
  AttendanceResponse,
  AttendanceRecord,
  AttendanceStats,
  ClassInfo,
  StudentInfo,
  Grade,
  ProcedureSubmission,
  WeChatBindResponse,
  UserStatusDto,
} from './types'

// Mock 登录响应
export const mockLoginResponse: LoginResponse = {
  userId: 1,
  username: '001',
  name: '测试用户1',
  role: 'teacher',
  token: 'Bearer mock-token-1234567890',
  isFirstLogin: false,
  wxNickname: '测试微信',
  wxAvatar: 'https://example.com/avatar.jpg',
}

// Mock 二维码数据
export const mockTeacherQr: TeacherQrVO = {
  seconds: 300,
  fileKey: 'mock-qr-key-12345',
}

// Mock 签到响应
export const mockAttendanceResponse: AttendanceResponse = {
  success: true,
  attendanceStatus: 0, // 正常签到
  attendanceTime: new Date().toISOString(),
  classCode: 'CS101',
  experimentId: 'EXP001',
  courseId: 'COURSE001',
  message: '签到成功',
}

// Mock 签到记录
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    studentId: 1,
    studentName: '张三',
    studentUsername: '2023001',
    classCode: 'CS101',
    experimentId: 'EXP001',
    courseId: 'COURSE001',
    attendanceStatus: 0,
    attendanceTime: '2024-01-15T10:00:00',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    studentId: 2,
    studentName: '李四',
    studentUsername: '2023002',
    classCode: 'CS101',
    experimentId: 'EXP001',
    courseId: 'COURSE001',
    attendanceStatus: 1, // 迟到
    attendanceTime: '2024-01-15T10:15:00',
    createdAt: '2024-01-15T10:15:00',
  },
]

// Mock 签到统计
export const mockAttendanceStats: AttendanceStats = {
  totalAttendances: 10,
  presentCount: 8,
  lateCount: 1,
  absentCount: 1,
  attendanceRate: 90.0,
}

// Mock 班级信息
export const mockClasses: ClassInfo[] = [
  {
    id: 1,
    classCode: 'CS101',
    className: '计算机科学101班',
    courseId: 1,
    courseName: '数据结构',
    teacherId: 1,
    teacherName: '王老师',
    studentCount: 45,
    createdAt: '2024-01-01T00:00:00',
  },
  {
    id: 2,
    classCode: 'CS102',
    className: '计算机科学102班',
    courseId: 2,
    courseName: '算法设计',
    teacherId: 1,
    teacherName: '王老师',
    studentCount: 40,
    createdAt: '2024-01-01T00:00:00',
  },
]

// Mock 学生信息
export const mockStudents: StudentInfo[] = [
  {
    id: 1,
    username: '2023001',
    name: '张三',
    role: 'student',
    className: 'CS101',
  },
  {
    id: 2,
    username: '2023002',
    name: '李四',
    role: 'student',
    className: 'CS101',
  },
  {
    id: 3,
    username: '2023003',
    name: '王五',
    role: 'student',
    className: 'CS102',
  },
]

// Mock 成绩信息
export const mockGrades: Grade[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 1,
    courseId: 1,
    experimentId: 1,
    score: 95,
    status: 'approved',
    comment: '实验报告优秀',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    studentId: 2,
    studentName: 2,
    courseId: 1,
    experimentId: 1,
    score: 88,
    status: 'approved',
    comment: '实验报告良好',
    createdAt: '2024-01-15T10:00:00',
  },
]

// Mock 实验报告提交
export const mockProcedureSubmissions: ProcedureSubmission[] = [
  {
    id: 1,
    studentId: 1,
    studentName: '张三',
    courseId: 1,
    experimentId: 1,
    experimentTitle: '实验一：链表操作',
    fileKey: 'file-key-001',
    fileName: '张三-实验一报告.pdf',
    submitTime: '2024-01-15T10:00:00',
    status: 'submitted',
    score: 95,
    comment: '实验报告优秀',
  },
  {
    id: 2,
    studentId: 2,
    studentName: '李四',
    courseId: 1,
    experimentId: 1,
    experimentTitle: '实验一：链表操作',
    fileKey: 'file-key-002',
    fileName: '李四-实验一报告.pdf',
    submitTime: '2024-01-15T11:00:00',
    status: 'submitted',
    score: 88,
    comment: '实验报告良好',
  },
  {
    id: 3,
    studentId: 3,
    studentName: '王五',
    courseId: 1,
    experimentId: 1,
    experimentTitle: '实验一：链表操作',
    fileKey: '',
    fileName: '',
    status: 'not_submitted',
  },
]

// Mock 微信绑定状态
export const mockWeChatBindStatus: WeChatBindResponse = {
  userId: 1,
  username: '001',
  name: '测试用户1',
  wxBound: true,
  wxNickname: '测试微信',
  wxAvatar: 'https://example.com/avatar.jpg',
  wxBindTime: '2024-01-01T00:00:00',
}

// Mock 用户状态
export const mockUserStatus: UserStatusDto = {
  exists: true,
  passwordSet: true,
  role: 'student',
  name: '张三',
}
