/**
 * 实验步骤相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'
import type { ProcedureType } from '../types'

/**
 * 步骤类型
 */
export const PROCEDURE_TYPE = {
  VIDEO: 1,
  DATA_COLLECTION: 2,
  TOPIC: 3,
} as const

/**
 * 数据采集类型
 */
export const DATA_COLLECTION_TYPE = {
  KEY_DATA: 1,
  TABLE_DATA: 2,
} as const

/**
 * 步骤类型选项
 */
export const PROCEDURE_TYPE_OPTIONS: Array<{
  label: string
  value: ProcedureType
  icon: string
  description: string
}> = [
  {
    label: '观看视频',
    value: PROCEDURE_TYPE.VIDEO,
    icon: 'pi pi-video',
    description: '学生观看指定视频内容',
  },
  {
    label: '数据收集',
    value: PROCEDURE_TYPE.DATA_COLLECTION,
    icon: 'pi pi-chart-bar',
    description: '学生按要求收集实验数据',
  },
  {
    label: '题库答题',
    value: PROCEDURE_TYPE.TOPIC,
    icon: 'pi pi-question',
    description: '从题库中抽取题目进行答题',
  },
]

/**
 * 数据采集类型选项
 */
export const DATA_COLLECTION_TYPE_OPTIONS = [
  {
    label: '关键数据',
    value: DATA_COLLECTION_TYPE.KEY_DATA,
    description: '采集关键实验数据，系统自动判分',
  },
  {
    label: '表格数据',
    value: DATA_COLLECTION_TYPE.TABLE_DATA,
    description: '采集表格形式数据，教师人工判分',
  },
]

/**
 * 默认值
 */
export const DEFAULT_VALUES = {
  PROPORTION: 10,
  MIN_PROPORTION: 0,
  MAX_PROPORTION: 100,
} as const

/**
 * 步骤表单基础字段配置
 */
export const PROCEDURE_BASE_FIELDS: FormFieldConfig[] = [
  {
    prop: 'remark',
    label: '步骤描述',
    type: 'textarea',
    placeholder: '请输入步骤描述',
    required: true,
    rules: [
      { required: true, message: '请输入步骤描述', trigger: 'blur' },
      { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'proportion',
    label: '分数占比(%)',
    type: 'number',
    placeholder: '请输入分数占比',
    required: true,
    rules: [
      { required: true, message: '请输入分数占比', trigger: 'blur' },
      { type: 'number', min: DEFAULT_VALUES.MIN_PROPORTION, max: DEFAULT_VALUES.MAX_PROPORTION, message: `占比在 ${DEFAULT_VALUES.MIN_PROPORTION}-${DEFAULT_VALUES.MAX_PROPORTION} 之间`, trigger: 'blur' },
    ],
  },
  {
    prop: 'isSkip',
    label: '是否可跳过',
    type: 'switch',
  },
]

/**
 * API 端点
 */
export const PROCEDURE_API_ENDPOINTS = {
  base: '/api/teacher/procedures',
} as const

/**
 * 预定义标签
 */
export const PREDEFINED_TAGS = [
  '单选题',
  '多选题',
  '判断题',
  '填空题',
  '简答题',
  '计算题',
  '基础',
  '中等',
  '困难',
  '章节一',
  '章节二',
  '章节三',
] as const

/**
 * 表单占位符文本
 */
export const FORM_PLACEHOLDERS = {
  JSON_FIELD: '{"字段1": "答案1", "字段2": "答案2"}',
  ROW_HEADERS: '行1,行2,行3',
  COLUMN_HEADERS: '列1,列2,列3',
  CUSTOM_TAG: '输入自定义标签',
  TOPIC_IDS: '如：1,2,3,4,5',
} as const

export const JSON_FIELD_PLACEHOLDER = FORM_PLACEHOLDERS.JSON_FIELD
export const ROW_HEADERS_PLACEHOLDER = FORM_PLACEHOLDERS.ROW_HEADERS
export const COLUMN_HEADERS_PLACEHOLDER = FORM_PLACEHOLDERS.COLUMN_HEADERS
export const CUSTOM_TAG_PLACEHOLDER = FORM_PLACEHOLDERS.CUSTOM_TAG
export const TOPIC_IDS_PLACEHOLDER = FORM_PLACEHOLDERS.TOPIC_IDS

/**
 * 表单提示文本
 */
export const FORM_HINTS = {
  TOPIC_IDS: '用逗号分隔多个题目ID',
} as const

export const TOPIC_IDS_HINT = FORM_HINTS.TOPIC_IDS

/**
 * 按钮文本
 */
export const BUTTON_LABELS = {
  ADD: '添加',
} as const

export const ADD_BUTTON_LABEL = BUTTON_LABELS.ADD

/**
 * 验证规则
 */
export const VALIDATION_RULES = {
  MIN_TOPIC_NUMBER: 1,
} as const

export const MIN_TOPIC_NUMBER = VALIDATION_RULES.MIN_TOPIC_NUMBER
