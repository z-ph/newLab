/**
 * 题目类型枚举
 */
export const TOPIC_TYPE = {
  SINGLE_CHOICE: 1,    // 单选题
  MULTIPLE_CHOICE: 2,  // 多选题
  TRUE_FALSE: 3,       // 判断题
  FILL_BLANK: 4,       // 填空题
  SHORT_ANSWER: 5,     // 简答题
} as const

export type TopicType = typeof TOPIC_TYPE[keyof typeof TOPIC_TYPE]

/**
 * 标签类型枚举
 */
export const TAG_TYPE = {
  SUBJECT: "1",        // 学科标签
  DIFFICULTY: "2",     // 难度标签
  CUSTOM: "4",         // 自定义标签
} as const

export type TagType = typeof TAG_TYPE[keyof typeof TAG_TYPE]

/**
 * 题目类型映射
 */
export const TOPIC_TYPE_MAP: Record<number, string> = {
  1: "单选题",
  2: "多选题",
  3: "判断题",
  4: "填空题",
  5: "简答题",
}

/**
 * 题目类型选项（用于下拉选择）
 */
export const TOPIC_TYPE_OPTIONS: Array<{ label: string; value: number }> = [
  { label: "单选题", value: 1 },
  { label: "多选题", value: 2 },
  { label: "判断题", value: 3 },
  { label: "填空题", value: 4 },
  { label: "简答题", value: 5 },
]

/**
 * 题目类型颜色映射
 */
export const TOPIC_TYPE_SEVERITY_MAP: Record<number, "success" | "info" | "warn" | "contrast"> = {
  1: "success",
  2: "info",
  3: "warn",
  4: "contrast",
  5: "contrast",
}

/**
 * 选项标签 ASCII 码起始值（A = 65）
 * 用于生成 A, B, C... 选项标签
 */
export const CHOICE_LABEL_START_CHAR_CODE = 65

/**
 * 默认选项数量
 */
export const DEFAULT_CHOICES_COUNT = 4

/**
 * 最大选项数量
 */
export const MAX_CHOICES_COUNT = 8

/**
 * 获取题目类型名称
 */
export function getTopicTypeName(type?: number): string {
  if (!type) return "-"
  return TOPIC_TYPE_MAP[type] || "未知"
}

/**
 * 获取题目类型对应的颜色
 */
export function getTopicTypeSeverity(type?: number): "success" | "info" | "warn" | "contrast" | undefined {
  if (!type) return undefined
  return TOPIC_TYPE_SEVERITY_MAP[type]
}
