/**
 * 实验步骤相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'
import type { ProcedureType } from '../types'

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
    value: 1,
    icon: 'pi pi-video',
    description: '学生观看指定视频内容',
  },
  {
    label: '数据收集',
    value: 2,
    icon: 'pi pi-chart-bar',
    description: '学生按要求收集实验数据',
  },
  {
    label: '题库答题',
    value: 3,
    icon: 'pi pi-question',
    description: '从题库中抽取题目进行答题',
  },
]

/**
 * 数据采集类型选项
 */
export const DATA_COLLECTION_TYPE_OPTIONS = [
  { label: '关键数据', value: 1, description: '采集关键实验数据，系统自动判分' },
  { label: '表格数据', value: 2, description: '采集表格形式数据，教师人工判分' },
]

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
      { type: 'number', min: 0, max: 100, message: '占比在 0-100 之间', trigger: 'blur' },
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
