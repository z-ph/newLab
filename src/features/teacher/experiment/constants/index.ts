/**
 * 实验管理相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'
import type { ExperimentStatus } from '../types'

/**
 * 实验表单配置
 */
export const EXPERIMENT_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'courseId',
    label: '所属课程',
    type: 'select',
    placeholder: '请选择课程',
    required: true,
    options: [], // 动态加载
    rules: [{ required: true, message: '请选择课程', trigger: 'change' }],
  },
  {
    prop: 'experimentName',
    label: '实验名称',
    type: 'input',
    placeholder: '请输入实验名称',
    required: true,
    rules: [
      { required: true, message: '请输入实验名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'percentage',
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
    prop: 'endTime',
    label: '截止时间',
    type: 'date-picker',
    placeholder: '请选择截止时间',
    required: true,
    rules: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  },
]

/**
 * 实验状态选项
 */
export const EXPERIMENT_STATUS_OPTIONS: Array<{
  label: string
  value: ExperimentStatus
  severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
}> = [
  { label: '草稿', value: 'draft', severity: 'secondary' },
  { label: '已发布', value: 'published', severity: 'success' },
  { label: '已截止', value: 'closed', severity: 'info' },
]

/**
 * API 端点
 */
export const EXPERIMENT_API_ENDPOINTS = {
  base: '/api/teacher/experiments',
} as const
