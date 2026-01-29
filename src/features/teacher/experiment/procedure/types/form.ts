/**
 * 实验步骤表单数据类型
 */

import type { PROCEDURE_TYPE } from '../constants'

/**
 * 步骤表单数据
 */
export interface ProcedureFormData {
  // 基础字段
  type: (typeof PROCEDURE_TYPE)[keyof typeof PROCEDURE_TYPE] | null
  remark: string
  proportion: number
  isSkip: boolean
  startTime: Date | null
  endTime: Date | null

  // 视频步骤字段
  videoId: number | null

  // 数据收集步骤字段
  dataType: number | null
  dataFieldsJson: string
  tableRowHeadersStr: string
  tableColumnHeadersStr: string

  // 题库答题步骤字段
  isRandom: boolean
  topicNumber: number | null
  topicTags: string[]
  teacherSelectedTopicIdsStr: string
}

/**
 * 默认表单数据
 */
export function createDefaultProcedureFormData(): ProcedureFormData {
  return {
    type: null,
    remark: '',
    proportion: 10,
    isSkip: false,
    startTime: null,
    endTime: null,

    videoId: null,

    dataType: null,
    dataFieldsJson: '',
    tableRowHeadersStr: '',
    tableColumnHeadersStr: '',

    isRandom: false,
    topicNumber: null,
    topicTags: [],
    teacherSelectedTopicIdsStr: '',
  }
}
