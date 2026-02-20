/**
 * 学生端题目相关常量
 * 复用 teacher 端题目类型定义，添加学��端特有配置
 */

// 复用 teacher 端题目类型常量
export {
  TOPIC_TYPE,
  TOPIC_TYPE_MAP,
  TOPIC_TYPE_OPTIONS,
  TOPIC_TYPE_SEVERITY_MAP,
  CHOICE_LABEL_START_CHAR_CODE,
  DEFAULT_CHOICES_COUNT,
  MAX_CHOICES_COUNT,
  getTopicTypeName,
  getTopicTypeSeverity,
  type TopicType,
} from '@/features/teacher/topic/constants/types'

/**
 * 答案格式提示
 * 帮助学生理解不同题型的答案格式
 */
export const ANSWER_FORMAT_HINT = {
  1: '请选择一个选项',
  2: '可选择多个选项，答案以 A-B-C 格式提交',
  3: '请选择对或错',
  4: '请填写答案内容',
  5: '请输入详细的文字回答',
} as const

/**
 * 选项标签 A-H
 */
export const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

/**
 * 判断题选项
 */
export const TRUE_FALSE_OPTIONS = [
  { label: '对', value: 'A' },
  { label: '错', value: 'B' },
] as const
