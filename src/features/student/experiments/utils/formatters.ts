/**
 * 实验相关格式化函数
 */

/**
 * 获取提交类型对应的标签颜色
 * @param type - 提交类型
 * @returns PrimeVue Tag severity
 */
export function getSubmissionTypeSeverity(
  type: string
): 'success' | 'info' | 'warning' | 'danger' {
  const severityMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> =
    {
      实验报告: 'info',
      数据文件: 'success',
      其他: 'warning',
    }
  return severityMap[type] || 'info'
}
