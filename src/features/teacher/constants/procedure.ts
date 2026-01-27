/**
 * 步骤管理相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'

/**
 * 视频步骤表单配置
 */
export const VIDEO_PROCEDURE_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'experimentId',
    label: '所属实验',
    type: 'select',
    placeholder: '请选择实验',
    required: true,
    options: [], // 动态加载
    rules: [{ required: true, message: '请选择实验', trigger: 'change' }],
  },
  {
    prop: 'videoId',
    label: '视频',
    type: 'select',
    placeholder: '请选择视频',
    required: true,
    options: [], // 动态加载
    rules: [{ required: true, message: '请选择视频', trigger: 'change' }],
  },
  {
    prop: 'proportion',
    label: '分数占比(%)',
    type: 'number',
    placeholder: '请输入分数占比',
    required: true,
    rules: [
      { required: true, message: '请输入分数占比', trigger: 'blur' },
      { type: 'number', min: 0, max: 100, message: '占比在 0-100 之间', trigger: 'blur' },
    ],
  },
  {
    prop: 'isSkip',
    label: '是否可跳过',
    type: 'switch',
  },
  {
    prop: 'remark',
    label: '步骤描述',
    type: 'textarea',
    placeholder: '请输入步骤描述',
    rules: [{ max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }],
  },
]

/**
 * 数据收集步骤表单配置
 */
export const DATA_COLLECTION_PROCEDURE_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'experimentId',
    label: '所属实验',
    type: 'select',
    placeholder: '请选择实验',
    required: true,
    options: [], // 动态加载
    rules: [{ required: true, message: '请选择实验', trigger: 'change' }],
  },
  {
    prop: 'dataCollectionType',
    label: '收集类型',
    type: 'select',
    placeholder: '请选择收集类型',
    required: true,
    options: [
      { label: '关键数据', value: 1 },
      { label: '表格数据', value: 2 },
    ],
    rules: [{ required: true, message: '请选择收集类型', trigger: 'change' }],
  },
  {
    prop: 'dataRemark',
    label: '数据描述',
    type: 'textarea',
    placeholder: '请输入数据描述',
    rules: [{ max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }],
  },
  {
    prop: 'proportion',
    label: '分数占比(%)',
    type: 'number',
    placeholder: '请输入分数占比',
    required: true,
    rules: [
      { required: true, message: '请输入分数占比', trigger: 'blur' },
      { type: 'number', min: 0, max: 100, message: '占比在 0-100 之间', trigger: 'blur' },
    ],
  },
  {
    prop: 'isSkip',
    label: '是否可跳过',
    type: 'switch',
  },
  {
    prop: 'dataNeedPhoto',
    label: '需要提交照片',
    type: 'switch',
  },
  {
    prop: 'dataNeedDoc',
    label: '需要提交文档',
    type: 'switch',
  },
  {
    prop: 'remark',
    label: '步骤描述',
    type: 'textarea',
    placeholder: '请输入步骤描述',
    rules: [{ max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }],
  },
]

/**
 * 题库步骤表单配置
 */
export const TOPIC_PROCEDURE_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'experimentId',
    label: '所属实验',
    type: 'select',
    placeholder: '请选择实验',
    required: true,
    options: [], // 动态加载
    rules: [{ required: true, message: '请选择实验', trigger: 'change' }],
  },
  {
    prop: 'topicIsRandom',
    label: '随机抽取题目',
    type: 'switch',
  },
  {
    prop: 'topicNumber',
    label: '题目数量',
    type: 'number',
    placeholder: '请输入题目数量',
    rules: [
      { type: 'number', min: 1, message: '题目数量至少为 1', trigger: 'blur' },
    ],
  },
  {
    prop: 'topicTags',
    label: '标签限制',
    type: 'input',
    placeholder: '请输入标签，多个标签用逗号分隔',
  },
  {
    prop: 'proportion',
    label: '分数占比(%)',
    type: 'number',
    placeholder: '请输入分数占比',
    required: true,
    rules: [
      { required: true, message: '请输入分数占比', trigger: 'blur' },
      { type: 'number', min: 0, max: 100, message: '占比在 0-100 之间', trigger: 'blur' },
    ],
  },
  {
    prop: 'isSkip',
    label: '是否可跳过',
    type: 'switch',
  },
  {
    prop: 'remark',
    label: '步骤描述',
    type: 'textarea',
    placeholder: '请输入步骤描述',
    rules: [{ max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }],
  },
]

/**
 * 步骤类型选项
 */
export const PROCEDURE_TYPE_OPTIONS = [
  { label: '观看视频', value: 1 },
  { label: '数据收集', value: 2 },
  { label: '题库答题', value: 3 },
]

/**
 * 数据收集类型选项
 */
export const DATA_COLLECTION_TYPE_OPTIONS = [
  { label: '关键数据', value: 1 },
  { label: '表格数据', value: 2 },
]

/**
 * API 端点
 */
export const PROCEDURE_API_ENDPOINTS = {
  base: '/api/teacher/procedures',
} as const
