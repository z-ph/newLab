/**
 * 统计相关类型
 */

import type {
  ClassExperimentStatisticsResponse,
  StudentCompletionInfo,
  ProcedureStatistics,
} from '@/core/api/generated'

/**
 * 班级实验统计类型
 */
export type ClassExperimentStatistics = ClassExperimentStatisticsResponse

/**
 * 学生完成信息类型
 */
export type StudentCompletion = StudentCompletionInfo

/**
 * 步骤统计类型
 */
export type ProcedureStatisticsEntity = ProcedureStatistics
