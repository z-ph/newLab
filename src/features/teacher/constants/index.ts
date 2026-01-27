/**
 * 老师端常量定义
 *
 * 架构说明：
 * - 业务特定常量：定义在对应的模块文件中（class.ts, experiment.ts 等）
 * - 通用常量：从 @/features/shared/constants 导入
 */

// ============================================================================
// 从共享常量导入通用配置
// ============================================================================

export {
  // UI 配置
  TABLE_ACTIONS,
  PAGINATION_CONFIG,
  DEFAULT_FORM_CONFIG,
  DIALOG_CONFIG,
  // 消息文本
  MESSAGE_TEXT,
} from '@/features/shared/constants'

// ============================================================================
// 导入业务特定常量
// ============================================================================

// 班级相关
export {
  CLASS_FORM_FIELDS,
  CLASS_API_ENDPOINTS,
} from './class'

// 实验相关
export {
  EXPERIMENT_FORM_FIELDS,
  EXPERIMENT_STATUS_OPTIONS,
  EXPERIMENT_API_ENDPOINTS,
} from './experiment'

// 步骤相关
export {
  VIDEO_PROCEDURE_FORM_FIELDS,
  DATA_COLLECTION_PROCEDURE_FORM_FIELDS,
  TOPIC_PROCEDURE_FORM_FIELDS,
  PROCEDURE_TYPE_OPTIONS,
  DATA_COLLECTION_TYPE_OPTIONS,
  PROCEDURE_API_ENDPOINTS,
} from './procedure'

// 提交相关
export {
  GRADING_FORM_FIELDS,
  SUBMISSION_STATUS_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  SUBMISSION_API_ENDPOINTS,
} from './submission'

// 成绩相关
export {
  GRADE_API_ENDPOINTS,
} from './grade'

// 签到相关
export {
  ATTENDANCE_API_ENDPOINTS,
} from './attendance'

// ============================================================================
// Teacher 特定配置
// ============================================================================

import type { MenuItem } from '@/features/shared/types'
import { MENU_ITEMS as MENU_ITEMS_TYPED } from '../types/menu'

/**
 * 菜单配置（类型安全）
 */
export const MENU_ITEMS: MenuItem[] = MENU_ITEMS_TYPED as unknown as MenuItem[]

/**
 * API 端点汇总
 * 注意：各个模块的 API 端点已在各自文件中定义，这里仅作参考
 * @deprecated 建议直接使用各个模块的 API_ENDPOINTS
 */
export const API_ENDPOINTS = {
  classes: '/api/teacher/class',
  experiments: '/api/teacher/experiments',
  procedures: '/api/teacher/procedures',
  submissions: '/api/teacher/procedure-submissions',
  grades: '/api/teacher/grades',
  attendance: '/api/teacher/attendance',
  students: '/api/teacher/students',
} as const
