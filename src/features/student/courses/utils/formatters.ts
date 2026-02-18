/**
 * 课程相关格式化函数
 */

import { formatDateTime } from '@/features/shared/utils/formatters'

/**
 * 格式化日期时间范围，包含状态判断
 * @param start 开始时间
 * @param end 结束时间
 * @returns 格式化后的字符串，如 "2024-01-15 进行中"
 */
export function formatDateTimeRange(start?: string, end?: string): string {
  if (!start || !end) return ''

  const startDate = new Date(start)
  const endDate = new Date(end)
  const now = new Date()

  // 判断课程状态
  let status = ''
  if (now < startDate) {
    status = '未开始'
  } else if (now > endDate) {
    status = '已结束'
  } else {
    status = '进行中'
  }

  const dateStr = formatDateTime(start).split(' ')[0] // 只取日期部分
  return `${dateStr} ${status}`
}

/**
 * 从提交记录中提取课程名称
 */
export function getCourseName(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未知课程'

  // 尝试从提交记录中获取课程名称
  const first = submissions[0]
  return first.courseName || first.courseId || '未知课程'
}

/**
 * 从提交记录中提取实验名称
 */
export function getExperimentName(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未知实验'

  // 尝试从提交记录中获取实验名称
  const first = submissions[0]
  return first.experimentName || first.experimentId || '未知实验'
}

/**
 * 获取课程进度
 */
export function getCourseProgress(submissions: any[]): { completed: number; total: number } {
  if (!submissions || submissions.length === 0) {
    return { completed: 0, total: 0 }
  }

  const total = submissions.length
  const completed = submissions.filter(
    (s) => s.submissionStatus === 2 // 2-已提交
  ).length

  return { completed, total }
}

/**
 * 获取教师名称
 *
 * @param submissions - 提交记录数组
 * @returns 教师名称
 */
export function getTeacherName(submissions: any[]): string {
  if (!submissions || submissions.length === 0) return '未知教师'
  return submissions[0].teacherName || '教师'
}

/**
 * 获取进度标签文本
 *
 * @param submissions - 提交记录数组
 * @returns 进度标签文本（未开始、刚开始、进行中、已完成）
 */
export function getProgressLabel(submissions: any[]): string {
  const { completed, total } = getCourseProgress(submissions)
  if (total === 0) return '未开始'
  const percentage = (completed / total) * 100
  if (percentage === 100) return '已完成'
  if (percentage >= 50) return '进行中'
  return '刚开始'
}

/**
 * 获取进度标签颜色（用于 PrimeVue Tag 组件）
 *
 * @param submissions - 提交记录数组
 * @returns PrimeVue Tag 的 severity 属性值
 */
export function getProgressSeverity(submissions: any[]): 'success' | 'info' | 'warning' | 'danger' {
  const { completed, total } = getCourseProgress(submissions)
  if (total === 0) return 'info'
  const percentage = (completed / total) * 100
  if (percentage === 100) return 'success'
  if (percentage >= 50) return 'info'
  return 'warning'
}
