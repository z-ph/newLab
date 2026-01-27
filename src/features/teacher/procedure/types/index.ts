/**
 * 步骤管理相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  TeacherProcedureDetailResponse,
  CreateVideoProcedureRequest,
  CreateDataCollectionProcedureRequest,
  CreateTopicProcedureRequest,
} from '@/core/api/generated'

/**
 * 步骤实体类型
 */
export type ProcedureEntity = TeacherProcedureDetailResponse

/**
 * 步骤类型枚举
 */
export type ProcedureType = 1 | 2 | 3 // 1-观看视频，2-数据收集，3-题库答题

/**
 * 视频步骤表单类型
 */
export type VideoProcedureFormData = FormData<CreateVideoProcedureRequest>

/**
 * 数据收集步骤表单类型
 */
export type DataCollectionProcedureFormData = FormData<CreateDataCollectionProcedureRequest>

/**
 * 题库步骤表单类型
 */
export type TopicProcedureFormData = FormData<CreateTopicProcedureRequest>
