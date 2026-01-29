/**
 * 实验步骤相关类型
 */

import type { FormData } from '@/features/shared/types'
import type {
  TeacherProcedureDetailResponse,
  CreateVideoProcedureRequest,
  CreateDataCollectionProcedureRequest,
  CreateTopicProcedureRequest,
  UpdateVideoProcedureRequest,
  UpdateDataCollectionProcedureRequest,
  UpdateTopicProcedureRequest,
} from '@/core/api/generated'

/**
 * 步骤实体类型 - 从 API 类型派生
 */
export type ProcedureEntity = TeacherProcedureDetailResponse

/**
 * 步骤类型枚举
 */
export type ProcedureType = 1 | 2 | 3 // 1-观看视频，2-数据收集，3-题库答题

/**
 * 数据类型枚举（用于数据采集步骤）
 */
export type DataCollectionDataType = 1 | 2 // 1-关键数据，2-表格数据

/**
 * 视频步骤表单类型
 */
export type VideoProcedureFormData = FormData<CreateVideoProcedureRequest>

/**
 * 数据采集步骤表单类型
 */
export type DataCollectionProcedureFormData = FormData<CreateDataCollectionProcedureRequest>

/**
 * 主题答题步骤表单类型
 */
export type TopicProcedureFormData = FormData<CreateTopicProcedureRequest>

/**
 * 视频步骤更新表单类型
 */
export type VideoProcedureUpdateFormData = FormData<UpdateVideoProcedureRequest>

/**
 * 数据采集步骤更新表单类型
 */
export type DataCollectionProcedureUpdateFormData = FormData<UpdateDataCollectionProcedureRequest>

/**
 * 主题答题步骤更新表单类型
 */
export type TopicProcedureUpdateFormData = FormData<UpdateTopicProcedureRequest>

/**
 * 导出表单相关类型
 */
export type {
  ProcedureFormData,
  BaseProcedureFields,
  VideoProcedureFields,
  KeyDataCollectionFields,
  TableDataCollectionFields,
  TopicProcedureFields,
} from './form'

export { createDefaultProcedureFormData, DATA_COLLECTION_TYPE } from './form'
