/**
 * 实验步骤相关类型定义
 * 所有类型从 API 类型派生
 */

import type { StudentProcedureDetailResponse } from '@/core/api/generated'

/**
 * 实验步骤类型（从 API 类型派生）
 */
export type ProcedureStep = StudentProcedureDetailResponse
