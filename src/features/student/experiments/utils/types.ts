/**
 * 实验步骤相关类型定义
 */

/**
 * 实验步骤接口
 */
export interface ProcedureStep {
  id: number
  stepType: number
  procedureName?: string
  videoUrl?: string
  topicContent?: string
  dataCollectionInstruction?: string
  isCompleted: boolean
  // 时间配置字段
  offsetMinutes?: number
  durationMinutes?: number
}
