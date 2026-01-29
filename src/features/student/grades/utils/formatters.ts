/**
 * 格式化日期时间
 * @param dateStr - 日期字符串
 * @returns 格式化后的日期时间字符串
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

/**
 * 获取成绩等级颜色
 * @param gradeNumeric - 数字成绩
 * @returns PrimeVue Tag severity
 */
export function getGradeSeverity(
  gradeNumeric?: number
): 'success' | 'info' | 'warning' | 'danger' {
  if (!gradeNumeric) return 'info'
  if (gradeNumeric >= 90) return 'success'
  if (gradeNumeric >= 80) return 'info'
  if (gradeNumeric >= 60) return 'warning'
  return 'danger'
}

/**
 * 获取成绩等级文本
 * @param gradeNumeric - 数字成绩
 * @returns 成绩等级文本
 */
export function getGradeLevel(gradeNumeric?: number): string {
  if (!gradeNumeric) return '-'
  if (gradeNumeric >= 90) return '优秀'
  if (gradeNumeric >= 80) return '良好'
  if (gradeNumeric >= 60) return '及格'
  return '不及格'
}
