/**
 * 实验步骤表单数据类型
 *
 * 设计原则：
 * 1. 每种步骤类型都有独立的接口定义，体现类型安全
 * 2. 提供运行时使用的联合类型，方便表单绑定
 * 3. 所有类型都继承自 BaseProcedureFields，保证基础字段的一致性
 */

import type { PROCEDURE_TYPE } from '../constants'

/**
 * 基础步骤字段（所有步骤共有）
 */
export interface BaseProcedureFields {
  type: (typeof PROCEDURE_TYPE)[keyof typeof PROCEDURE_TYPE] | null
  remark: string
  proportion: number
  isSkip: boolean
  /** 步骤开始时间偏移量(分钟)，默认为0 */
  offsetMinutes: number
  /** 步骤持续时间(分钟) */
  durationMinutes: number
}

/**
 * 视频步骤表单数据
 */
export interface VideoProcedureFields {
  videoId: number | null
}

/**
 * 关键数据收集步骤表单数据
 */
export interface KeyDataCollectionFields {
  dataType: typeof DATA_COLLECTION_TYPE.KEY_DATA
  dataFieldsJson: string
  tolerance: number | null
}

/**
 * 表格数据收集步骤表单数据
 */
export interface TableDataCollectionFields {
  dataType: typeof DATA_COLLECTION_TYPE.TABLE_DATA
  tableRowHeadersStr: string
  tableColumnHeadersStr: string
  tableCellAnswersJson: string
}

/**
 * 题库答题步骤表单数据
 */
export interface TopicProcedureFields {
  isRandom: boolean
  topicNumber: number | null
  topicTags: string[]
  teacherSelectedTopicIdsStr: string
}

/**
 * 完整的步骤表单数据（用于运行时表单绑定）
 *
 * 注意：这是运行时使用的类型，包含所有可能的字段
 * 实际使用时根据 type 字段判断哪些字段有效
 */
export interface ProcedureFormData extends BaseProcedureFields {
  // 视频步骤字段
  videoId: number | null

  // 数据收集步骤字段
  dataType: number | null
  dataFieldsJson: string
  tolerance: number | null
  tableRowHeadersStr: string
  tableColumnHeadersStr: string
  tableCellAnswersJson: string

  // 题库答题步骤字段
  isRandom: boolean
  topicNumber: number | null
  topicTags: string[]
  teacherSelectedTopicIdsStr: string
}

/**
 * 数据采集类型常量
 */
export const DATA_COLLECTION_TYPE = {
  KEY_DATA: 1,
  TABLE_DATA: 2,
} as const

/**
 * 创建默认的步骤表单数据
 */
export function createDefaultProcedureFormData(): ProcedureFormData {
  return {
    // 基础字段
    type: null,
    remark: '',
    proportion: 10,
    isSkip: false,
    offsetMinutes: 0,
    durationMinutes: 60,

    // 视频步骤字段
    videoId: null,

    // 数据收集步骤字段
    dataType: null,
    dataFieldsJson: '',
    tolerance: null,
    tableRowHeadersStr: '',
    tableColumnHeadersStr: '',
    tableCellAnswersJson: '',

    // 题库答题步骤字段
    isRandom: false,
    topicNumber: null,
    topicTags: [],
    teacherSelectedTopicIdsStr: '',
  }
}
