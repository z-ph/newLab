/**
 * 学生端题目工具函数
 */

import { TOPIC_TYPE } from '../constants/topic'
import type { TopicItem1, TopicChoice } from '@/core/api/generated'

/**
 * 解析后的选项结构
 */
export interface ParsedChoice {
  label: string      // 选项标签 A, B, C...
  content: string    // 选项内容
}

/**
 * 解析题目选项
 * 支持两种格式：
 * 1. 新格式：TopicChoice[] 数组
 * 2. 旧格式：JSON 字符串 '{"A":"选项A","B":"选项B"}'
 */
export function parseTopicChoices(choices?: string | TopicChoice[]): ParsedChoice[] {
  if (!choices) return []

  // 新格式：数组
  if (Array.isArray(choices)) {
    return choices
      .filter(choice => choice.optionKey && choice.optionContent)
      .map(choice => ({
        label: choice.optionKey!,
        content: choice.optionContent!.trim(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  // 旧格式：JSON 字符串
  try {
    const parsed = JSON.parse(choices) as Record<string, string>
    return Object.entries(parsed)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, content]) => ({
        label,
        content: content.trim(),
      }))
      .filter(choice => choice.content)
  } catch {
    return []
  }
}

/**
 * 解析已提交答案 JSON
 * answer 是 JSON 字符串格式: {"题目ID": "答案", ...}
 */
export function parseSubmittedAnswer(answer?: string): Record<string, string> {
  if (!answer) return {}

  try {
    return JSON.parse(answer) as Record<string, string>
  } catch {
    return {}
  }
}

/**
 * 验证答案有效性
 * @param topicType 题目类型
 * @param answer 答案内容
 * @returns 是否有效
 */
export function validateAnswer(topicType: number, answer: string): boolean {
  if (!answer || answer.trim() === '') return false

  switch (topicType) {
    case TOPIC_TYPE.SINGLE_CHOICE:
    case TOPIC_TYPE.TRUE_FALSE:
      // 单选/判断: 必须是单个字母 A-H
      return /^[A-H]$/i.test(answer)

    case TOPIC_TYPE.MULTIPLE_CHOICE:
      // 多选: 必须是 A-B-C 格式
      return /^[A-H](-[A-H])+$/.test(answer)

    case TOPIC_TYPE.FILL_BLANK:
    case TOPIC_TYPE.SHORT_ANSWER:
      // 填空/简答: 只要有内容即可
      return answer.trim().length > 0

    default:
      return false
  }
}

/**
 * 多选答案排序并格式化
 * 将 ["B", "A", "C"] 转换为 "A-B-C"
 */
export function sortMultipleChoiceAnswer(answers: string[]): string {
  if (!answers || answers.length === 0) return ''

  // 按字母顺序排序
  const sorted = [...answers]
    .filter(a => a)
    .sort((a, b) => a.localeCompare(b))

  // 用 - 连接
  return sorted.join('-')
}

/**
 * 从多选答案字符串解析出选中的选项数组
 * 将 "A-B-C" 转换为 ["A", "B", "C"]
 */
export function parseMultipleChoiceAnswer(answer: string): string[] {
  if (!answer) return []
  return answer.split('-').filter(a => a)
}

/**
 * 获取题目的默认答案
 */
export function getDefaultAnswer(topicType: number): string {
  switch (topicType) {
    case TOPIC_TYPE.SINGLE_CHOICE:
    case TOPIC_TYPE.TRUE_FALSE:
    case TOPIC_TYPE.MULTIPLE_CHOICE:
      return ''
    case TOPIC_TYPE.FILL_BLANK:
    case TOPIC_TYPE.SHORT_ANSWER:
      return ''
    default:
      return ''
  }
}

/**
 * 构建答案提交数据
 * 将答案对象转换为 API 所需格式
 */
export function buildAnswersPayload(
  answers: Record<number, string>
): Record<string, string> {
  const payload: Record<string, string> = {}

  for (const [topicId, answer] of Object.entries(answers)) {
    if (answer !== undefined && answer !== null) {
      payload[topicId] = answer
    }
  }

  return payload
}

/**
 * 检查是否所有必答题目都已作答
 */
export function checkAllRequiredAnswered(
  topics: TopicItem1[],
  answers: Record<number, string>
): boolean {
  return topics.every(topic => {
    const topicId = topic.id
    if (!topicId) return true

    const answer = answers[topicId]
    return validateAnswer(topic.type ?? 0, answer ?? '')
  })
}

/**
 * 获取题目答案显示文本
 */
export function getAnswerDisplayText(
  topicType: number,
  answer: string,
  choices?: string
): string {
  if (!answer) return '-'

  switch (topicType) {
    case TOPIC_TYPE.SINGLE_CHOICE:
    case TOPIC_TYPE.MULTIPLE_CHOICE: {
      // 显示选项内容
      const parsedChoices = parseTopicChoices(choices)
      const selectedLabels = parseMultipleChoiceAnswer(answer)

      if (selectedLabels.length === 0) return answer

      const selectedContents = selectedLabels
        .map(label => {
          const choice = parsedChoices.find(c => c.label === label)
          return choice ? `${label}. ${choice.content}` : label
        })

      return selectedContents.join('；')
    }

    case TOPIC_TYPE.TRUE_FALSE:
      return answer === 'A' ? '对' : '错'

    case TOPIC_TYPE.FILL_BLANK:
    case TOPIC_TYPE.SHORT_ANSWER:
      return answer

    default:
      return answer
  }
}
