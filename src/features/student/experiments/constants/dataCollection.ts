/**
 * 数据采集步骤常量
 */

import { DATA_COLLECTION_TYPE } from '@/features/teacher/experiment/procedure/constants'

/**
 * 数据采集类型标签
 */
export const DATA_COLLECTION_TYPE_LABELS = {
  [DATA_COLLECTION_TYPE.KEY_DATA]: '关键数据',
  [DATA_COLLECTION_TYPE.TABLE_DATA]: '表格数据',
} as const

/**
 * 文件上传限制
 */
export const FILE_UPLOAD_LIMITS = {
  PHOTO_MAX_SIZE: 10 * 1024 * 1024,      // 10MB
  DOC_MAX_SIZE: 20 * 1024 * 1024,        // 20MB
  PHOTO_ACCEPT: 'image/*',
  DOC_ACCEPT: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const

/**
 * 错误提示消息
 */
export const ERROR_MESSAGES = {
  PHOTO_REQUIRED: '请上传照片',
  DOC_REQUIRED: '请上传文档',
  INVALID_PHOTO_FORMAT: '请上传图片文件',
  INVALID_DOC_FORMAT: '请上传 Word 文档（.doc 或 .docx）',
  PHOTO_TOO_LARGE: '照片大小不能超过 10MB',
  DOC_TOO_LARGE: '文档大小不能超过 20MB',
} as const

/**
 * 空状态提示消息
 */
export const EMPTY_MESSAGES = {
  NO_FIELDS: '暂无数据字段，请先配置',
  NO_TABLE: '暂无表格数据，请先配置',
} as const

/**
 * 表单占位符
 */
export const FORM_PLACEHOLDERS = {
  FIELD_VALUE: '请输入数据',
  TABLE_CELL: '请输入',
  UPLOAD_PHOTO: '点击上传照片',
  UPLOAD_DOC: '点击上传文档',
} as const
