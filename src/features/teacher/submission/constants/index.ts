/**
 * 提交批改相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'
import type { SubmissionStatus, StudentStatus } from '../types'

/**
 * 评分表单配置
 */
export const GRADING_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'score',
    label: '分数',
    type: 'number',
    placeholder: '请输入分数',
    required: true,
    rules: [
      { required: true, message: '请输入分数', trigger: 'blur' },
      { type: 'number', min: 0, max: 100, message: '分数在 0-100 之间', trigger: 'blur' },
    ],
  },
  {
    prop: 'comment',
    label: '评语',
    type: 'textarea',
    placeholder: '请输入评语',
    rules: [{ max: 500, message: '评语不能超过 500 个字符', trigger: 'blur' }],
  },
]

/**
 * 提交状态选项
 */
export const SUBMISSION_STATUS_OPTIONS: Array<{
  label: string
  value: SubmissionStatus
  severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
}> = [
  { label: '草稿', value: 'draft', severity: 'secondary' },
  { label: '已提交', value: 'submitted', severity: 'info' },
  { label: '已审核', value: 'reviewed', severity: 'success' },
  { label: '需重做', value: 'rejected', severity: 'danger' },
]

/**
 * 学生状态选项
 * 注意：这个应该从 student feature 导入，这里暂时保留
 * TODO: 考虑将学生相关常量移到 student feature
 */
export const STUDENT_STATUS_OPTIONS: Array<{
  label: string
  value: StudentStatus
  severity: 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast'
}> = [
  { label: '在读', value: 'active', severity: 'success' },
  { label: '休学', value: 'inactive', severity: 'info' },
  { label: '毕业', value: 'graduated', severity: 'secondary' },
  { label: '退学', value: 'suspended', severity: 'danger' },
]

/**
 * API 端点
 */
export const SUBMISSION_API_ENDPOINTS = {
  base: '/api/teacher/procedure-submissions',
  students: '/api/teacher/students',
} as const
