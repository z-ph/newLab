/**
 * 签到表格每页显示条数
 */
export const ATTENDANCE_TABLE_PAGE_SIZE = 10

/**
 * 未签到表格每页显示条数
 */
export const NOT_ATTENDANCE_TABLE_PAGE_SIZE = 5

/**
 * 步骤类型枚举
 */
export const PROCEDURE_TYPE = {
  VIDEO: 1,
  DATA_COLLECTION: 2,
  TOPIC: 3,
  TIMED_QUIZ: 4,
} as const

/**
 * 步骤类型文本映射
 */
export const PROCEDURE_TYPE_TEXT_MAP: Record<number, string> = {
  [PROCEDURE_TYPE.VIDEO]: '视频观看',
  [PROCEDURE_TYPE.DATA_COLLECTION]: '数据收集',
  [PROCEDURE_TYPE.TOPIC]: '话题讨论',
  [PROCEDURE_TYPE.TIMED_QUIZ]: '计时测验',
} as const
