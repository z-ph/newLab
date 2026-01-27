/**
 * 通用表单类型
 */

import type { FormData } from './utils'

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  prop: string
  label: string
  type: 'input' | 'textarea' | 'select' | 'date' | 'date-picker' | 'number' | 'switch' | 'upload'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ label: string; value: string | number }>
  rules?: any[]
}

/**
 * 表单对话框配置
 */
export interface FormDialogConfig {
  title: string
  width?: string
  visible: boolean
  loading?: boolean
}

// 重新导出工具类型
export type { FormData }
