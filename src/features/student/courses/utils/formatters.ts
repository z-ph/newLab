/**
 * 课程相关格式化函数
 */

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
