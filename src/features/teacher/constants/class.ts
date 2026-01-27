/**
 * 班级管理相关常量
 */

import type { FormFieldConfig } from '@/features/shared/types'

/**
 * 班级表单配置
 */
export const CLASS_FORM_FIELDS: FormFieldConfig[] = [
  {
    prop: 'classCode',
    label: '班级代码',
    type: 'input',
    placeholder: '请输入班级代码',
    required: true,
    rules: [
      { required: true, message: '请输入班级代码', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'className',
    label: '班级名称',
    type: 'input',
    placeholder: '请输入班级名称',
    required: true,
    rules: [
      { required: true, message: '请输入班级名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
    ],
  },
  {
    prop: 'description',
    label: '班级描述',
    type: 'textarea',
    placeholder: '请输入班级描述',
    rules: [{ max: 500, message: '描述不能超过 500 个字符', trigger: 'blur' }],
  },
]

/**
 * API 端点
 */
export const CLASS_API_ENDPOINTS = {
  base: '/api/teacher/class',
} as const
