import type { TopicDetailResponse } from "@/core/api/generated"

/**
 * 标签类型映射
 */
export const TAG_TYPE_MAP: Record<string, string> = {
  "1": "学科标签",
  "2": "难度标签",
  "3": "题型标签",
  "4": "自定义标签",
}

/**
 * 获取标签类型名称
 */
export function getTagTypeName(tagType?: string): string {
  if (!tagType) return "-"
  return TAG_TYPE_MAP[tagType] || "未知"
}

/**
 * 格式化选项内容
 * 输入: "A:选项A$B:选项B"
 * 输出: ["A: 选项A", "B: 选项B"]
 */
export function formatChoices(choices?: string): string[] {
  if (!choices) return []
  return choices.split("$").map((choice) => choice.replace(/^([A-Z]):/, "$1: "))
}

/**
 * 格式化标签列表
 * 提取所有标签名称，用逗号分隔
 */
export function formatTagNames(topic?: TopicDetailResponse): string {
  if (!topic?.tags || topic.tags.length === 0) return "-"
  return topic.tags.map((tagggggg) => tagggggg.tagName || "").filter(Boolean).join("、")
}

/**
 * 根据标签类型筛选标签
 */
export function filterTagsByType(tags?: Array<{ tagType?: string }>, targetType?: string) {
  if (!tags) return []
  if (!targetType) return tags
  return tags.filter((tagggggg) => tagggggg.tagType === targetType)
}
