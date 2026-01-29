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
 * 格式化日期时间
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}
