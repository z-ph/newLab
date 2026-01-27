/**
 * Mock API 客户端
 * 模拟后端 API 调用，返回固定的成功数据
 */

import type {
  ApiResponse,
  ClassInfo,
  Grade,
  AttendanceRecord,
  ProcedureSubmission,
  PageResponse,
} from './types'
import {
  mockLoginResponse,
  mockTeacherQr,
  mockAttendanceResponse,
  mockAttendanceRecords,
  mockAttendanceStats,
  mockClasses,
  mockStudents,
  mockGrades,
  mockProcedureSubmissions,
  mockWeChatBindStatus,
  mockUserStatus,
} from './mockData'

/**
 * Mock API 客户端类
 */
export class MockApiClient {
  private static instance: MockApiClient

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): MockApiClient {
    if (!MockApiClient.instance) {
      MockApiClient.instance = new MockApiClient()
    }
    return MockApiClient.instance
  }

  /**
   * 创建成功的 API 响应
   */
  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return {
      code: 0,
      message: 'success',
      data,
    }
  }

  /**
   * 模拟网络延迟
   */
  private async delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ==================== 认证相关 ====================

  /**
   * 用户登录
   */
  async login(username: string, _password: string): Promise<ApiResponse<typeof mockLoginResponse>> {
    await this.delay()
    console.log(`[Mock API] 登录: username=${username}, password=***`)
    return this.createSuccessResponse(mockLoginResponse)
  }

  /**
   * 重置密码
   */
  async resetPassword(username: string): Promise<ApiResponse<void>> {
    await this.delay()
    console.log(`[Mock API] 重置密码: username=${username}`)
    return this.createSuccessResponse(undefined)
  }

  /**
   * 设置密码
   */
  async setPassword(_password: string, _confirmPassword: string): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 设置密码: password=***`)
    return this.createSuccessResponse(true)
  }

  /**
   * 检查用户状态
   */
  async checkUserStatus(username: string): Promise<ApiResponse<typeof mockUserStatus>> {
    await this.delay()
    console.log(`[Mock API] 检查用户状态: username=${username}`)
    return this.createSuccessResponse(mockUserStatus)
  }

  /**
   * 微信登录
   */
  async loginByOpenid(openid: string): Promise<ApiResponse<typeof mockLoginResponse>> {
    await this.delay()
    console.log(`[Mock API] 微信登录: openid=${openid}`)
    return this.createSuccessResponse(mockLoginResponse)
  }

  /**
   * 验证码登录
   */
  async loginByCode(username: string, code: string): Promise<ApiResponse<typeof mockLoginResponse>> {
    await this.delay()
    console.log(`[Mock API] 验证码登录: username=${username}, code=${code}`)
    return this.createSuccessResponse(mockLoginResponse)
  }

  // ==================== 二维码相关 ====================

  /**
   * 获取签到二维码（教师）
   */
  async getTeacherQr(classExperimentId?: number): Promise<ApiResponse<typeof mockTeacherQr>> {
    await this.delay()
    console.log(`[Mock API] 获取签到二维码: classExperimentId=${classExperimentId}`)
    return this.createSuccessResponse(mockTeacherQr)
  }

  /**
   * 根据班级代码和实验ID获取签到二维码
   */
  async getTeacherQrByClassExperiment(
    classCode: string,
    experimentId: string
  ): Promise<ApiResponse<typeof mockTeacherQr>> {
    await this.delay()
    console.log(`[Mock API] 获取签到二维码: classCode=${classCode}, experimentId=${experimentId}`)
    return this.createSuccessResponse(mockTeacherQr)
  }

  /**
   * 学生扫描二维码签到
   */
  async studentScanQr(key: string): Promise<ApiResponse<typeof mockAttendanceResponse>> {
    await this.delay()
    console.log(`[Mock API] 学生扫描二维码: key=${key}`)
    return this.createSuccessResponse(mockAttendanceResponse)
  }

  // ==================== 签到相关 ====================

  /**
   * 获取签到列表
   */
  async getAttendanceList(params?: {
    classCode?: string
    experimentId?: string
    page?: number
    size?: number
  }): Promise<ApiResponse<PageResponse<AttendanceRecord>>> {
    await this.delay()
    console.log('[Mock API] 获取签到列表:', params)
    return this.createSuccessResponse({
      content: mockAttendanceRecords,
      totalElements: mockAttendanceRecords.length,
      totalPages: 1,
      size: 10,
      number: 0,
    })
  }

  /**
   * 更新签到状态
   */
  async updateAttendance(
    attendanceId: number,
    status: number
  ): Promise<ApiResponse<typeof mockAttendanceResponse>> {
    await this.delay()
    console.log(`[Mock API] 更新签到状态: attendanceId=${attendanceId}, status=${status}`)
    return this.createSuccessResponse(mockAttendanceResponse)
  }

  // ==================== 教师班级管理 ====================

  /**
   * 查询教师班级列表
   */
  async getTeacherClassList(): Promise<ApiResponse<typeof mockClasses>> {
    await this.delay()
    console.log('[Mock API] 查询教师班级列表')
    return this.createSuccessResponse(mockClasses)
  }

  /**
   * 根据班级代码查询班级信息
   */
  async getClassByCode(classCode: string): Promise<ApiResponse<ClassInfo | undefined>> {
    await this.delay()
    console.log(`[Mock API] 查询班级信息: classCode=${classCode}`)
    const classInfo = mockClasses.find((c) => c.classCode === classCode)
    return this.createSuccessResponse(classInfo || mockClasses[0])
  }

  /**
   * 创建班级
   */
  async createClass(classData: {
    classCode: string
    className: string
    courseId: number
  }): Promise<ApiResponse<ClassInfo>> {
    await this.delay()
    console.log('[Mock API] 创建班级:', classData)
    return this.createSuccessResponse(mockClasses[0]!)
  }

  /**
   * 批量创建班级
   */
  async batchCreateClasses(classes: Array<{
    classCode: string
    className: string
    courseId: number
  }>): Promise<ApiResponse<typeof mockClasses>> {
    await this.delay()
    console.log('[Mock API] 批量创建班级:', classes)
    return this.createSuccessResponse(mockClasses)
  }

  /**
   * 获取班级学生列表
   */
  async getClassStudents(classCode: string): Promise<ApiResponse<typeof mockStudents>> {
    await this.delay()
    console.log(`[Mock API] 获取班级学生: classCode=${classCode}`)
    return this.createSuccessResponse(mockStudents)
  }

  /**
   * 绑定学生到班级
   */
  async bindStudentsToClass(
    classCode: string,
    studentUsernames: string[]
  ): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 绑定学生到班级: classCode=${classCode}, students=${studentUsernames.length}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 解绑班级学生
   */
  async unbindStudentsFromClass(
    classCode: string,
    studentUsernames: string[]
  ): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 解绑班级学生: classCode=${classCode}, students=${studentUsernames.length}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 绑定实验到班级
   */
  async bindExperimentToClass(
    classCode: string,
    experimentId: string
  ): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 绑定实验到班级: classCode=${classCode}, experimentId=${experimentId}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 解绑班级实验
   */
  async unbindExperimentFromClass(experimentId: string): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 解绑班级实验: experimentId=${experimentId}`)
    return this.createSuccessResponse(true)
  }

  // ==================== 教师签到管理 ====================

  /**
   * 获取教师签到记录
   */
  async getTeacherAttendanceRecords(params?: {
    classCode?: string
    experimentId?: string
  }): Promise<ApiResponse<PageResponse<AttendanceRecord>>> {
    await this.delay()
    console.log('[Mock API] 获取教师签到记录:', params)
    return this.createSuccessResponse({
      content: mockAttendanceRecords,
      totalElements: mockAttendanceRecords.length,
      totalPages: 1,
      size: 10,
      number: 0,
    })
  }

  /**
   * 教师更新签到记录
   */
  async updateTeacherAttendance(
    attendanceId: number,
    status: number
  ): Promise<ApiResponse<void>> {
    await this.delay()
    console.log(`[Mock API] 教师更新签到: attendanceId=${attendanceId}, status=${status}`)
    return this.createSuccessResponse(undefined)
  }

  /**
   * 获取签到统计
   */
  async getAttendanceCount(params?: {
    classCode?: string
    experimentId?: string
  }): Promise<ApiResponse<typeof mockAttendanceStats>> {
    await this.delay()
    console.log('[Mock API] 获取签到统计:', params)
    return this.createSuccessResponse(mockAttendanceStats)
  }

  // ==================== 学生签到相关 ====================

  /**
   * 获取学生签到记录
   */
  async getStudentAttendanceRecords(): Promise<ApiResponse<typeof mockAttendanceRecords>> {
    await this.delay()
    console.log('[Mock API] 获取学生签到记录')
    return this.createSuccessResponse(mockAttendanceRecords)
  }

  /**
   * 获取学生签到统计
   */
  async getStudentAttendanceStats(): Promise<ApiResponse<typeof mockAttendanceStats>> {
    await this.delay()
    console.log('[Mock API] 获取学生签到统计')
    return this.createSuccessResponse(mockAttendanceStats)
  }

  // ==================== 微信相关 ====================

  /**
   * 获取微信绑定状态
   */
  async getWeChatBindStatus(): Promise<ApiResponse<typeof mockWeChatBindStatus>> {
    await this.delay()
    console.log('[Mock API] 获取微信绑定状态')
    return this.createSuccessResponse(mockWeChatBindStatus)
  }

  /**
   * 绑定微信
   */
  async bindWeChat(code: string): Promise<ApiResponse<typeof mockWeChatBindStatus>> {
    await this.delay()
    console.log(`[Mock API] 绑定微信: code=${code}`)
    return this.createSuccessResponse(mockWeChatBindStatus)
  }

  /**
   * 解绑微信
   */
  async unbindWeChat(): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log('[Mock API] 解绑微信')
    return this.createSuccessResponse(true)
  }

  // ==================== 成绩管理 ====================

  /**
   * 获取课程成绩列表（教师）
   */
  async getCourseGrades(courseId: number): Promise<ApiResponse<typeof mockGrades>> {
    await this.delay()
    console.log(`[Mock API] 获取课程成绩: courseId=${courseId}`)
    return this.createSuccessResponse(mockGrades)
  }

  /**
   * 获取成绩详情
   */
  async getGradeDetail(gradeId: number): Promise<ApiResponse<Grade>> {
    await this.delay()
    console.log(`[Mock API] 获取成绩详情: gradeId=${gradeId}`)
    return this.createSuccessResponse(mockGrades[0]!)
  }

  /**
   * 批量上传成绩
   */
  async uploadGrades(grades: Array<{
    studentId: number
    courseId: number
    experimentId: number
    score: number
  }>): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 批量上传成绩: grades=${grades.length}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 审核成绩
   */
  async approveGrade(gradeId: number, approved: boolean): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 审核成绩: gradeId=${gradeId}, approved=${approved}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 获取学生成绩
   */
  async getStudentGrades(): Promise<ApiResponse<typeof mockGrades>> {
    await this.delay()
    console.log('[Mock API] 获取学生成绩')
    return this.createSuccessResponse(mockGrades)
  }

  /**
   * 学生绑定班级
   */
  async studentBindClass(classCode: string): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 学生绑定班级: classCode=${classCode}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 获取学生班级列表
   */
  async getStudentClasses(): Promise<ApiResponse<typeof mockClasses>> {
    await this.delay()
    console.log('[Mock API] 获取学生班级列表')
    return this.createSuccessResponse(mockClasses)
  }

  // ==================== 实验报告提交 ====================

  /**
   * 获取课程实验报告提交（教师）
   */
  async getCourseSubmissions(courseId: number): Promise<ApiResponse<typeof mockProcedureSubmissions>> {
    await this.delay()
    console.log(`[Mock API] 获取课程实验报告: courseId=${courseId}`)
    return this.createSuccessResponse(mockProcedureSubmissions)
  }

  /**
   * 获取实验报告详情
   */
  async getSubmissionDetail(submissionId: number): Promise<ApiResponse<ProcedureSubmission>> {
    await this.delay()
    console.log(`[Mock API] 获取实验报告详情: submissionId=${submissionId}`)
    return this.createSuccessResponse(mockProcedureSubmissions[0]!)
  }

  /**
   * 教师批改实验报告
   */
  async gradeSubmission(
    submissionId: number,
    score: number,
    _comment?: string
  ): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 批改实验报告: submissionId=${submissionId}, score=${score}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 学生上传实验报告
   */
  async uploadSubmission(
    courseId: number,
    experimentId: number,
    _fileKey: string,
    _fileName: string
  ): Promise<ApiResponse<ProcedureSubmission>> {
    await this.delay()
    console.log(`[Mock API] 上传实验报告: courseId=${courseId}, experimentId=${experimentId}`)
    return this.createSuccessResponse(mockProcedureSubmissions[0]!)
  }

  /**
   * 学生提交实验报告
   */
  async submitSubmission(submissionId: number): Promise<ApiResponse<boolean>> {
    await this.delay()
    console.log(`[Mock API] 提交实验报告: submissionId=${submissionId}`)
    return this.createSuccessResponse(true)
  }

  /**
   * 获取学生实验报告
   */
  async getStudentSubmissions(): Promise<ApiResponse<typeof mockProcedureSubmissions>> {
    await this.delay()
    console.log('[Mock API] 获取学生实验报告')
    return this.createSuccessResponse(mockProcedureSubmissions)
  }

  /**
   * 获取学生课程实验报告
   */
  async getStudentCourseSubmissions(courseId: number): Promise<ApiResponse<typeof mockProcedureSubmissions>> {
    await this.delay()
    console.log(`[Mock API] 获取学生课程实验报告: courseId=${courseId}`)
    return this.createSuccessResponse(mockProcedureSubmissions)
  }
}

// 导出单例实例
export const apiClient = MockApiClient.getInstance()

// 默认导出类
export default MockApiClient
