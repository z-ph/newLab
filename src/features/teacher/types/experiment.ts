/**
 * 实验管理相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  ExperimentResponse,
  ExperimentInfo,
  CreateExperimentRequest,
} from '@/core/api/generated'

/**
 * 实体类型 - 从 API 类型派生
 */
export type ExperimentEntity = ExperimentInfo

/**
 * 实验详情类型
 */
export type ExperimentDetail = ExperimentResponse

/**
 * 实验表单类型 - 用于创建/编辑
 */
export type ExperimentFormData = FormData<CreateExperimentRequest>

/**
 * 实验状态枚举
 */
export type ExperimentStatus = 'draft' | 'published' | 'closed'
