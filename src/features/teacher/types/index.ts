/**
 * 老师端类型定义
 * 基于自动生成的 API 类型通过类型运算派生，避免重复定义
 *
 * 架构说明：
 * - 业务特定类型：定义在对应的模块文件中（class/types, experiment/types 等）
 * - 通用类型：从 @/features/shared/types 导入
 */

// ============================================================================
// 从共享类型导入通用类型
// ============================================================================

export type {
  // 表���相关
  FormData,
  FormFieldConfig,
  FormDialogConfig,
  // 表格相关
  TableColumn,
  PaginationParams,
  TableAction,
  // 菜单相关
  MenuItem,
  // 筛选相关
  FilterCondition,
  SearchParams,
} from '@/features/shared/types'

// ============================================================================
// 导入业务特定类型
// ============================================================================

// 班级相关
export type {
  ClassEntity,
  ClassDetail,
  ClassFormData,
  ClassQueryParams,
} from '../class/types'

// 实验相关
export type {
  ExperimentEntity,
  ExperimentDetail,
  ExperimentFormData,
  ExperimentStatus,
} from '../experiment/types'

// 步骤相关
export type {
  ProcedureEntity,
  ProcedureType,
} from '../experiment/procedure/types'

// 成绩相关
export type {
  GradeEntity,
  GradeFormData,
} from '../experiment/grade/types'

// 签到相关
export type {
  AttendanceRecordEntity,
  AttendanceInfo,
  StudentAttendanceInfoEntity,
  AttendanceStatus,
} from '../experiment/attendance/types'

// 统计相关
export type {
  ClassExperimentStatistics,
  StudentCompletion,
  ProcedureStatisticsEntity,
} from '../statistics/types'

// 菜单相关（类型安全）
export type {
  TeacherMenuItem,
  PrimeIcon,
  MenuRouteMap,
} from '../menu/types'
