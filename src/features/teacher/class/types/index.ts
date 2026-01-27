/**
 * 班级管理相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  ClassResponse,
  Class,
  CreateClassRequest,
} from '@/core/api/generated'

/**
 * 班级实体类型 - 从 API 类型派生
 */
export type ClassEntity = Class

/**
 * 班级详情类型 - 包含更多信息
 */
export type ClassDetail = ClassResponse

/**
 * 班级表单类型 - 用于创建/编辑
 */
export type ClassFormData = FormData<CreateClassRequest>

/**
 * 班级查询参数类型
 */
export interface ClassQueryParams {
  classCode?: string
  className?: string
  page?: number
  size?: number
}
