/**
 * 实验相关格式化函数
 */

/**
 * 格式化时间偏移量描述
 *
 * 将分钟数转换为友好的描述文本，用于显示"上课后多久开始"
 *
 * @param minutes - 偏移量（分钟）
 * @returns 格式化后的描述文本
 *
 * @example
 * formatOffsetDescription(0)    // "上课后立即开始"
 * formatOffsetDescription(30)   // "上课后 30 分钟开始"
 * formatOffsetDescription(90)   // "上课后 1 小时 30 分钟开始"
 * formatOffsetDescription(120)  // "上课后 2 小时开始"
 */
export function formatOffsetDescription(minutes: number): string {
  if (minutes === 0) return '上课后立即开始'
  if (minutes < 60) return `上课后 ${minutes} 分钟开始`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) return `上课后 ${hours} 小时开始`
  return `上课后 ${hours} 小时 ${mins} 分钟开始`
}

/**
 * 格式化持续时间描述
 *
 * 将分钟数转换为友好的描述文本，用于显示"持续时间"
 *
 * @param minutes - 持续时间（分钟）
 * @returns 格式化后的描述文本
 *
 * @example
 * formatDurationDescription(30)   // "持续 30 分钟"
 * formatDurationDescription(90)   // "持续 1 小时 30 分钟"
 * formatDurationDescription(120)  // "持续 2 小时"
 */
export function formatDurationDescription(minutes: number): string {
  if (minutes < 60) return `持续 ${minutes} 分钟`

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) return `持续 ${hours} 小时`
  return `持续 ${hours} 小时 ${mins} 分钟`
}
